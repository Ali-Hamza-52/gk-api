import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  WorkOrder,
  RequestType,
  WorkOrderStatus,
  WorkOrderPriority,
} from './entities/work-orders.entity';
import { CreateWorkOrderDto } from './dto/create-work-orders.dto';
import { UpdateWorkOrderDto } from './dto/update-work-orders.dto';
import { FilterWorkOrderDto } from './dto/work-order-filter.dto';
import { WorkOrderSummaryDto } from './dto/work-order-summary.dto';
import { ClientEntity } from '@/sales/clients/client.entity';
import { ClientLocationEntity } from '@/sales/clients/client-location.entity';
import { User } from '@/users/user.entity';
import { WorkOrderServicesService } from './work-order-services/work-order-services.service';
import { Op, WhereOptions } from 'sequelize';
import { paginateQuery } from '@/common/utils/db-pagination';
import { successResponse } from '@/common/utils/response';
import { PermissionService } from '@/permissions/permission.service';
import { applyOwnershipFilter } from '@/common/utils/permission-filter';
import { scheduled } from 'rxjs';

interface FilterParams extends FilterWorkOrderDto {
  userId?: number;
  roleId?: number;
}

interface SummaryParams extends WorkOrderSummaryDto {
  userId?: number;
  roleId?: number;
}

@Injectable()
export class WorkOrderService {
  constructor(
    @InjectModel(WorkOrder)
    private readonly workOrderModel: typeof WorkOrder,
    @InjectModel(ClientEntity)
    private readonly clientModel: typeof ClientEntity,
    @InjectModel(ClientLocationEntity)
    private readonly clientLocationModel: typeof ClientLocationEntity,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly workOrderServicesService: WorkOrderServicesService,
    private readonly permissionService: PermissionService,
  ) {}

  calculateWorkOrderValue = (): number => {
    return 5;
  };

  async create(dto: CreateWorkOrderDto, userId: number) {
    // Validate foreign keys
    await this.validateForeignKeys(dto);

    // Validate location belongs to client
    await this.validateLocationBelongsToClient(dto.client_id, dto.location_id);

    // If request_type is ServiceTask, validate services array
    if (dto.request_type === RequestType.ServiceTask) {
      if (!dto.services || dto.services.length === 0) {
        throw new BadRequestException(
          'Services array is required when request type is Service Task',
        );
      }
      // Note: Service validation will be done by WorkOrderServicesService
    }

    // Create work order payload
    const workOrderPayload: any = {
      client_id: dto.client_id,
      location_id: dto.location_id,
      contract_id: dto.contract_id ?? null,
      request_type: dto.request_type,
      priority: dto.priority ?? WorkOrderPriority.Critical,
      contact_person: dto.contact_person ?? null,
      contact_number: dto.contact_number ?? null,
      requested_by: dto.requested_by ?? userId,
      status: dto.status ?? WorkOrderStatus.Requested,
      assigned_technician: dto.assigned_technician ?? null,
      feedback_rating: dto.feedback_rating ?? null,
      feedback_comments: dto.feedback_comments ?? null,
      reopened_as_warranty: dto.reopened_as_warranty ?? false,
      notes: dto.notes ?? null,
      created_by: userId,
      updated_by: null,
      work_order_code: `WO-${dto.client_id}-${dto.location_id}`, // Will be updated after creation
      work_order_value: this.calculateWorkOrderValue(),
      scheduled_date: dto.scheduled_date ?? new Date(dto.scheduled_date),
    };

    // Convert date strings to Date objects
    if (dto.diagnosis_timestamp) {
      workOrderPayload.diagnosis_timestamp = new Date(dto.diagnosis_timestamp);
    }
    if (dto.scheduled_timestamp) {
      workOrderPayload.scheduled_timestamp = new Date(dto.scheduled_timestamp);
    }
    if (dto.sla_due_at) {
      workOrderPayload.sla_due_at = new Date(dto.sla_due_at);
    }
    if (dto.completed_at) {
      workOrderPayload.completed_at = new Date(dto.completed_at);
    }

    // Create work order
    const workOrder = await this.workOrderModel.create(workOrderPayload);

    // Generate and update work order code
    const workOrderCode = await this.generateWorkOrderCode(
      dto.client_id,
      dto.location_id,
      workOrder.id,
    );
    await workOrder.update({ work_order_code: workOrderCode });

    // If request_type is ServiceTask, create work order services
    let servicesCreated = 0;
    if (dto.request_type === RequestType.ServiceTask && dto.services?.length) {
      for (const serviceId of dto.services) {
        await this.workOrderServicesService.create(
          {
            work_order_id: workOrder.id,
            service_id_link: serviceId,
            task_status: 'Requested' as any,
            approved_by_client: false,
          },
          userId,
        );
        servicesCreated++;
      }
    }

    return successResponse('Work order created successfully', {
      id: workOrder.id,
      work_order_code: workOrderCode,
      requested_by: workOrder.requested_by,
      servicesCreated,
    });
  }

  async findAll(filterDto: FilterParams) {
    const {
      page = 1,
      perPage = 10,
      searchTerm,
      userId,
      roleId,
      ...filters
    } = filterDto;

    let where: WhereOptions<WorkOrder> = {};

    // Apply ownership filter
    if (userId && roleId) {
      const hasViewAll = await this.permissionService.hasViewAllPermission(
        roleId,
        'work_order',
      );
      where = applyOwnershipFilter(where, {
        userId,
        roleId,
        module: 'work_orders',
        hasViewAll,
      }) as WhereOptions<WorkOrder>;
    }

    // Search functionality
    if (searchTerm) {
      const searchFilter: WhereOptions<WorkOrder> = {
        [Op.or]: [
          { work_order_code: { [Op.like]: `%${searchTerm}%` } },
          { '$client.client_name$': { [Op.like]: `%${searchTerm}%` } },
          {
            '$clientLocation.location_name$': { [Op.like]: `%${searchTerm}%` },
          },
        ],
      };

      if (where[Op.and]) {
        (where[Op.and] as WhereOptions<WorkOrder>[]).push(searchFilter);
      } else if (Object.keys(where).length > 0) {
        where = {
          [Op.and]: [where, searchFilter],
        };
      } else {
        where = searchFilter;
      }
    }

    // Apply remaining filters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        const filterCondition: WhereOptions<WorkOrder> = {
          [key]: value,
        } as WhereOptions<WorkOrder>;

        if (where[Op.and]) {
          (where[Op.and] as WhereOptions<WorkOrder>[]).push(filterCondition);
        } else if (Object.keys(where).length > 0) {
          where = {
            [Op.and]: [where, filterCondition],
          };
        } else {
          where = filterCondition;
        }
      }
    }

    const result = await paginateQuery(this.workOrderModel, {
      where,
      include: [
        {
          model: this.clientModel,
          as: 'client',
          attributes: ['client_name', 'client_code'],
          required: false,
        },
        {
          model: this.clientLocationModel,
          as: 'clientLocation',
          attributes: ['id', 'location_name'],
          required: false,
        },
        {
          model: this.userModel,
          as: 'requester',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: this.userModel,
          as: 'technician',
          attributes: ['id', 'name'],
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
      page,
      perPage,
    });

    return successResponse('Work orders fetched successfully', result);
  }

  async findOne(id: number) {
    const record = await this.workOrderModel.findByPk(id, {
      include: [
        {
          model: this.clientModel,
          as: 'client',
          attributes: ['client_name', 'client_code'],
          required: false,
        },
        {
          model: this.clientLocationModel,
          as: 'clientLocation',
          attributes: ['id', 'location_name'],
          required: false,
        },
        {
          model: this.userModel,
          as: 'requester',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: this.userModel,
          as: 'technician',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: this.userModel,
          as: 'creator',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: this.userModel,
          as: 'updater',
          attributes: ['id', 'name'],
          required: false,
        },
      ],
    });

    if (!record) {
      throw new NotFoundException('Work order not found');
    }

    // If it's a ServiceTask, get the associated services
    let workOrderServices: any[] = [];
    if (record.request_type === RequestType.ServiceTask) {
      const servicesResponse = await this.workOrderServicesService.findAll({
        work_order_id: record.id,
        page: 1,
        perPage: 100, // Get all services for this work order
      });
      workOrderServices = servicesResponse.data?.items || [];
    }

    return successResponse('Work order fetched successfully', {
      ...record.toJSON(),
      workOrderServices,
    });
  }

  async update(
    id: number,
    dto: UpdateWorkOrderDto | Partial<UpdateWorkOrderDto>,
    userId: number,
  ) {
    const record = await this.workOrderModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Work order not found');
    }

    // Validate foreign keys if they are being updated
    await this.validateForeignKeys(dto);

    // Validate location belongs to client if both are provided or one is updated
    const clientId = dto.client_id ?? record.client_id;
    const locationId = dto.location_id ?? record.location_id;
    await this.validateLocationBelongsToClient(clientId, locationId);

    // Determine the final request_type (new or existing)
    const newRequestType = dto.request_type ?? record.request_type;
    const oldRequestType = record.request_type;

    // Validate services array based on request_type logic
    if (dto.services !== undefined || dto.request_type !== undefined) {
      // If request_type is ServiceTask, validate services array
      if (newRequestType === RequestType.ServiceTask) {
        if (
          dto.services !== undefined &&
          (!dto.services || dto.services.length === 0)
        ) {
          throw new BadRequestException(
            'Services array is required when request type is Service Task',
          );
        }
        // If changing to ServiceTask but no services provided, check if we need them
        if (
          dto.request_type === RequestType.ServiceTask &&
          dto.services === undefined
        ) {
          // Get existing services count
          const existingServicesResponse =
            await this.workOrderServicesService.findAll({
              work_order_id: id,
              page: 1,
              perPage: 1,
            });
          const hasExistingServices =
            (existingServicesResponse.data?.meta.total || 0) > 0;

          if (!hasExistingServices) {
            throw new BadRequestException(
              'Services array is required when changing request type to Service Task',
            );
          }
        }
      }

      // If request_type is Open, services should not be provided
      if (
        newRequestType === RequestType.Open &&
        dto.services !== undefined &&
        dto.services.length > 0
      ) {
        throw new BadRequestException(
          'Services array is not allowed when request type is Open',
        );
      }
    }

    const updatePayload: any = {
      updated_by: userId,
      updated_at: new Date(),
    };

    // Map all fields with proper null handling
    this.mapUpdateFields(dto, updatePayload);

    // Handle services array update
    let servicesCreated = 0;
    let servicesDeleted = 0;

    // If request_type changed from ServiceTask to Open, return error
    if (
      oldRequestType === RequestType.ServiceTask &&
      newRequestType === RequestType.Open
    ) {
      throw new BadRequestException(
        'Cannot change request type from ServiceTask to Open',
      );
    }

        // If request_type is ServiceTask and services array is provided, update services
    if (newRequestType === RequestType.ServiceTask && dto.services !== undefined) {
      // Get existing services
      const existingServicesResponse = await this.workOrderServicesService.findAll({
        work_order_id: id,
        page: 1,
        perPage: 10000,
      });

      const existingServices = existingServicesResponse.data?.items || [];
      const existingServiceIds = existingServices.map(service => service.service_id_link);
      const newServiceIds = dto.services || []; // Ensure it's not undefined

      // Find services to delete (existing but not in new array)
      const servicesToDelete = existingServices.filter(
        service => !newServiceIds.includes(service.service_id_link)
      );

      // Find services to create (in new array but not existing)
      const servicesToCreate = newServiceIds.filter(
        serviceId => !existingServiceIds.includes(serviceId)
      );

      // Delete services that are no longer needed
      for (const service of servicesToDelete) {
        await this.workOrderServicesService.remove(service.id);
        servicesDeleted++;
      }

      // Create new services
      for (const serviceId of servicesToCreate) {
        await this.workOrderServicesService.create(
          {
            work_order_id: id,
            service_id_link: serviceId,
            task_status: 'Requested' as any,
            approved_by_client: false,
          },
          userId,
        );
        servicesCreated++;
      }
    }

    // If changing from Open to ServiceTask and no services provided in DTO,
    // but we validated that existing services exist, keep them
    await record.update(updatePayload);

    return successResponse('Work order updated successfully', {
      id: record.id,
      work_order_code: record.work_order_code,
      updated_at: updatePayload.updated_at,
      servicesCreated,
      servicesDeleted,
      requestTypeChanged: oldRequestType !== newRequestType,
    });
  }

  async partialUpdate(
    id: number,
    dto: Partial<UpdateWorkOrderDto>,
    userId: number,
  ) {
    const record = await this.workOrderModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Work order not found');
    }

    // Validate foreign keys if they are being updated
    await this.validateForeignKeys(dto);

    // Validate location belongs to client if both are provided or one is updated
    const clientId = dto.client_id ?? record.client_id;
    const locationId = dto.location_id ?? record.location_id;
    await this.validateLocationBelongsToClient(clientId, locationId);

    // Determine the final request_type (new or existing)
    const newRequestType = dto.request_type ?? record.request_type;
    const oldRequestType = record.request_type;

    // Validate services array based on request_type logic (same as update)
    if (dto.services !== undefined || dto.request_type !== undefined) {
      // If request_type is ServiceTask, validate services array
      if (newRequestType === RequestType.ServiceTask) {
        if (
          dto.services !== undefined &&
          (!dto.services || dto.services.length === 0)
        ) {
          throw new BadRequestException(
            'Services array is required when request type is Service Task',
          );
        }
        // If changing to ServiceTask but no services provided, check if we need them
        if (
          dto.request_type === RequestType.ServiceTask &&
          dto.services === undefined
        ) {
          // Get existing services count
          const existingServicesResponse =
            await this.workOrderServicesService.findAll({
              work_order_id: id,
              page: 1,
              perPage: 1,
            });
          const hasExistingServices =
            (existingServicesResponse.data?.meta.total || 0) > 0;

          if (!hasExistingServices) {
            throw new BadRequestException(
              'Services array is required when changing request type to Service Task',
            );
          }
        }
      }

      // If request_type is Open, services should not be provided
      if (
        newRequestType === RequestType.Open &&
        dto.services !== undefined &&
        dto.services.length > 0
      ) {
        throw new BadRequestException(
          'Services array is not allowed when request type is Open',
        );
      }
    }

    const updatePayload: any = {
      updated_by: userId,
      updated_at: new Date(),
    };

    // Map only provided fields (partial update)
    this.mapUpdateFields(dto, updatePayload);

    // Handle services array update (same logic as update method)
    let servicesCreated = 0;
    let servicesDeleted = 0;

    // If request_type changed from ServiceTask to Open, delete existing services
    if (
      oldRequestType === RequestType.ServiceTask &&
      newRequestType === RequestType.Open
    ) {
      const existingServicesResponse =
        await this.workOrderServicesService.findAll({
          work_order_id: id,
          page: 1,
          perPage: 10000,
        });

      const existingServices = existingServicesResponse.data?.items || [];
      for (const service of existingServices) {
        await this.workOrderServicesService.remove(service.id);
        servicesDeleted++;
      }
    }

    // If request_type is ServiceTask and services array is provided, update services
    if (
      newRequestType === RequestType.ServiceTask &&
      dto.services !== undefined
    ) {
      // Delete existing services first
      const existingServicesResponse =
        await this.workOrderServicesService.findAll({
          work_order_id: id,
          page: 1,
          perPage: 10000,
        });

      const existingServices = existingServicesResponse.data?.items || [];
      for (const service of existingServices) {
        await this.workOrderServicesService.remove(service.id);
        servicesDeleted++;
      }

      // Create new services
      for (const serviceId of dto.services) {
        await this.workOrderServicesService.create(
          {
            work_order_id: id,
            service_id_link: serviceId,
            task_status: 'Requested' as any,
            approved_by_client: false,
          },
          userId,
        );
        servicesCreated++;
      }
    }

    await record.update(updatePayload);

    return successResponse('Work order partially updated successfully', {
      id: record.id,
      work_order_code: record.work_order_code,
      updated_at: updatePayload.updated_at,
      servicesCreated,
      servicesDeleted,
      requestTypeChanged: oldRequestType !== newRequestType,
    });
  }

  async remove(id: number) {
    const record = await this.workOrderModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Work order not found');
    }

    // Count services before deletion (for response)
    let deletedServices: number = 0;
    if (record.request_type === RequestType.ServiceTask) {
      const servicesResponse = await this.workOrderServicesService.findAll({
        work_order_id: id,
        page: 1,
        perPage: 10000,
      });

      deletedServices = servicesResponse.data?.meta.total || 0;
    }

    // Delete work order (services will be deleted by CASCADE from database level)
    await record.destroy();

    return successResponse(
      'Work order and associated services deleted successfully',
      {
        id,
        deletedServices,
      },
    );
  }

  async getSummary(params: SummaryParams) {
    const { client_id, userId, roleId } = params;

    let baseWhere: WhereOptions<WorkOrder> = {};

    // Apply ownership filter
    if (userId && roleId) {
      const hasViewAll = await this.permissionService.hasViewAllPermission(
        roleId,
        'work_order',
      );
      baseWhere = applyOwnershipFilter(baseWhere, {
        userId,
        roleId,
        module: 'work_order',
        hasViewAll,
      }) as WhereOptions<WorkOrder>;
    }

    // Apply client filter if provided
    if (client_id) {
      if (baseWhere[Op.and]) {
        (baseWhere[Op.and] as WhereOptions<WorkOrder>[]).push({ client_id });
      } else if (Object.keys(baseWhere).length > 0) {
        baseWhere = {
          [Op.and]: [baseWhere, { client_id }],
        };
      } else {
        baseWhere = { client_id };
      }
    }

    // Get total count
    const totalWorkOrders = await this.workOrderModel.count({
      where: baseWhere,
    });

    // Get status counts
    const statusCounts: Record<string, number> = {};
    for (const status of Object.values(WorkOrderStatus)) {
      let statusWhere: WhereOptions<WorkOrder>;
      if (baseWhere[Op.and]) {
        statusWhere = {
          [Op.and]: [
            ...(baseWhere[Op.and] as WhereOptions<WorkOrder>[]),
            { status },
          ],
        };
      } else if (Object.keys(baseWhere).length > 0) {
        statusWhere = {
          [Op.and]: [baseWhere, { status }],
        };
      } else {
        statusWhere = { status };
      }

      const count = await this.workOrderModel.count({ where: statusWhere });
      statusCounts[status] = count;
    }

    // Get priority counts
    const priorityCounts: Record<string, number> = {};
    const priorityLabels = {
      [WorkOrderPriority.Critical]: 'Critical',
      [WorkOrderPriority.High]: 'High',
      [WorkOrderPriority.Medium]: 'Medium',
      [WorkOrderPriority.Low]: 'Low',
      [WorkOrderPriority.Routine]: 'Routine',
    };

    for (const [priority, label] of Object.entries(priorityLabels)) {
      let priorityWhere: WhereOptions<WorkOrder>;
      const priorityCondition = { priority: parseInt(priority) };

      if (baseWhere[Op.and]) {
        priorityWhere = {
          [Op.and]: [
            ...(baseWhere[Op.and] as WhereOptions<WorkOrder>[]),
            priorityCondition,
          ],
        };
      } else if (Object.keys(baseWhere).length > 0) {
        priorityWhere = {
          [Op.and]: [baseWhere, priorityCondition],
        };
      } else {
        priorityWhere = priorityCondition;
      }

      const count = await this.workOrderModel.count({ where: priorityWhere });
      priorityCounts[label] = count;
    }

    return successResponse('Work orders summary fetched successfully', {
      totalWorkOrders,
      statusCounts,
      priorityCounts,
      ...(client_id && { clientId: client_id }),
    });
  }

  // Private helper methods

  private async generateWorkOrderCode(
    clientId: number,
    locationId: number,
    recordId: number,
  ): Promise<string> {
    const client = await this.clientModel.findByPk(clientId);
    if (!client || !client.client_code) {
      throw new BadRequestException(
        'Client code not found for generating work order code',
      );
    }
    return `WO-${client.client_code}-${locationId}-${recordId}`;
  }

  private async validateForeignKeys(
    dto: CreateWorkOrderDto | UpdateWorkOrderDto | Partial<UpdateWorkOrderDto>,
  ) {
    const errors: string[] = [];

    // Validate client_id
    if (dto.client_id) {
      const client = await this.clientModel.findByPk(dto.client_id);
      if (!client) {
        errors.push(`Client with ID ${dto.client_id} does not exist`);
      }
    }

    // Validate location_id
    if (dto.location_id) {
      const location = await this.clientLocationModel.findByPk(dto.location_id);
      if (!location) {
        errors.push(
          `Client location with ID ${dto.location_id} does not exist`,
        );
      }
    }

    // Validate requested_by user
    if (dto.requested_by) {
      const requester = await this.userModel.findByPk(dto.requested_by);
      if (!requester) {
        errors.push(`User with ID ${dto.requested_by} does not exist`);
      }
    }

    // Validate assigned_technician
    if (dto.assigned_technician) {
      const technician = await this.userModel.findByPk(dto.assigned_technician);
      if (!technician) {
        errors.push(
          `Technician with ID ${dto.assigned_technician} does not exist`,
        );
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Foreign key validation failed',
        errors: errors,
      });
    }
  }

  private async validateLocationBelongsToClient(
    clientId: number,
    locationId: number,
  ) {
    const location = await this.clientLocationModel.findOne({
      where: {
        id: locationId,
        client_code: clientId,
      },
    });

    if (!location) {
      throw new BadRequestException(
        `Location ID ${locationId} does not belong to client ID ${clientId}`,
      );
    }
  }

  private mapUpdateFields(
    dto: UpdateWorkOrderDto | Partial<UpdateWorkOrderDto>,
    updatePayload: any,
  ) {
    // Map numeric fields (handle 0 as valid value)
    if (dto.client_id !== undefined) {
      updatePayload.client_id = dto.client_id ?? null;
    }
    if (dto.location_id !== undefined) {
      updatePayload.location_id = dto.location_id ?? null;
    }
    if (dto.contract_id !== undefined) {
      updatePayload.contract_id = dto.contract_id ?? null;
    }
    if (dto.request_type !== undefined) {
      updatePayload.request_type = dto.request_type ?? null;
    }
    if (dto.priority !== undefined) {
      updatePayload.priority = dto.priority ?? null;
    }
    if (dto.requested_by !== undefined) {
      updatePayload.requested_by = dto.requested_by ?? null;
    }
    if (dto.assigned_technician !== undefined) {
      updatePayload.assigned_technician = dto.assigned_technician ?? null;
    }
    if (dto.feedback_rating !== undefined) {
      updatePayload.feedback_rating = dto.feedback_rating ?? null;
    }

    // Map string fields (use || null for empty strings)
    if (dto.contact_person !== undefined) {
      updatePayload.contact_person = dto.contact_person || null;
    }
    if (dto.contact_number !== undefined) {
      updatePayload.contact_number = dto.contact_number || null;
    }
    if (dto.status !== undefined) {
      updatePayload.status = dto.status || null;
    }
    if (dto.feedback_comments !== undefined) {
      updatePayload.feedback_comments = dto.feedback_comments || null;
    }
    if (dto.notes !== undefined) {
      updatePayload.notes = dto.notes || null;
    }

    // Map boolean fields
    if (dto.reopened_as_warranty !== undefined) {
      updatePayload.reopened_as_warranty = dto.reopened_as_warranty ?? false;
    }

    // Convert date strings to Date objects
    if (dto.diagnosis_timestamp !== undefined) {
      updatePayload.diagnosis_timestamp = dto.diagnosis_timestamp
        ? new Date(dto.diagnosis_timestamp)
        : null;
    }
    if (dto.scheduled_timestamp !== undefined) {
      updatePayload.scheduled_timestamp = dto.scheduled_timestamp
        ? new Date(dto.scheduled_timestamp)
        : null;
    }
    if (dto.sla_due_at !== undefined) {
      updatePayload.sla_due_at = dto.sla_due_at
        ? new Date(dto.sla_due_at)
        : null;
    }
    if (dto.completed_at !== undefined) {
      updatePayload.completed_at = dto.completed_at
        ? new Date(dto.completed_at)
        : null;
    }
  }
}
