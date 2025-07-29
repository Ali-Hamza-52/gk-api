import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { WorkOrderEntity } from './entities/work-orders.entity';
import { CreateWorkOrderDto } from './dto/create-work-orders.dto';
import { UpdateWorkOrderDto } from './dto/update-work-orders.dto';
import { WorkOrderFilterDto } from './dto/work-order-filter.dto';
import { ClientEntity } from '@/sales/clients/client.entity';
import { ClientLocationEntity } from '@/sales/clients/client-location.entity';
import { User } from '@/users/user.entity';
import { paginateQuery } from '@/common/utils/db-pagination';
import { successResponse } from '@/common/utils/response';
import { PermissionService } from '@/permissions/permission.service';
import { applyOwnershipFilter } from '@/common/utils/permission-filter';
import {
  WorkOrderStatus,
  WorkOrderPriority,
} from './entities/work-orders.entity';
import { transformWorkOrder } from './transformers/work-order.transformer';

@Injectable()
export class WorkOrderService {
  constructor(
    @InjectModel(WorkOrderEntity)
    private readonly workOrderModel: typeof WorkOrderEntity,
    @InjectModel(ClientEntity)
    private readonly clientModel: typeof ClientEntity,
    @InjectModel(ClientLocationEntity)
    private readonly clientLocationModel: typeof ClientLocationEntity,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly sequelize: Sequelize,
    private readonly permissionService: PermissionService,
  ) {}

  async create(dto: CreateWorkOrderDto, userId: number) {
    console.log('Creating work order with DTO:', dto);
    // Validate required fields first
    this.validateCreateDto(dto);

    // Validate foreign key constraints
    await this.validateForeignKeys(dto);

    // Additional validation: Check if location belongs to the client
    await this.validateLocationBelongsToClient(dto.client_id, dto.location_id);

    // Start transaction for atomic operations
    const transaction = await this.sequelize.transaction();

    try {
      // Set default status if not provided
      if (!dto.status) {
        dto.status = WorkOrderStatus.REQUESTED;
      }

      // Validate SLA due date is in future
      if (dto.sla_due_at) {
        const slaDate = new Date(dto.sla_due_at);
        if (slaDate <= new Date()) {
          throw new BadRequestException('SLA due date must be in the future');
        }
      }

      // Validate feedback rating range
      if (dto.feedback_rating !== undefined) {
        if (dto.feedback_rating < 1 || dto.feedback_rating > 5) {
          throw new BadRequestException(
            'Feedback rating must be between 1 and 5',
          );
        }
      }

      // Set created by user
      (dto as any).created_by = userId;
      (dto as any).updated_by = userId;

      // Create work order without work_order_code first
      const workOrderData = { ...dto };
      delete workOrderData.work_order_code;

      const workOrder = await this.workOrderModel.create(workOrderData as any, {
        transaction,
      });

      // Generate work order code using the created record ID
      const workOrderCode = await this.generateWorkOrderCode(
        dto.client_id,
        dto.location_id,
        workOrder.id,
      );

      // Update with generated work order code
      await workOrder.update(
        { work_order_code: workOrderCode },
        { transaction },
      );

      // Commit transaction
      await transaction.commit();

      return successResponse(
        'Work order created successfully',
        transformWorkOrder(await this.findOneRaw(workOrder.id)),
      );
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(
    filterDto: WorkOrderFilterDto,
    userId?: number,
    roleId?: number,
  ) {
    const { page = 1, perPage = 10 } = filterDto;

    let where = await this.buildAdvancedFilters(filterDto);

    // Apply ownership filter if user context is provided
    if (userId && roleId) {
      const hasViewAll = await this.permissionService.hasViewAllPermission(
        roleId,
        'work_orders',
      );
      where = applyOwnershipFilter(where, {
        userId,
        roleId,
        module: 'work_orders',
        hasViewAll,
      });
    }

    const result = await paginateQuery(this.workOrderModel, {
      where,
      include: [
        { model: ClientEntity, as: 'client' },
        { model: ClientLocationEntity, as: 'location' },
        { model: User, as: 'requester' },
        { model: User, as: 'technician' },
      ],
      order: [['id', 'DESC']],
      page,
      perPage,
    });

    const transformedItems = result.items.map((workOrder) =>
      transformWorkOrder(workOrder),
    );

    const transformedResult = {
      ...result,
      items: transformedItems,
    };

    return successResponse(
      'Work orders fetched successfully',
      transformedResult,
    );
  }

  async findOne(id: number) {
    const workOrder = await this.workOrderModel.findByPk(id, {
      include: [
        { model: ClientEntity, as: 'client' },
        { model: ClientLocationEntity, as: 'location' },
        { model: User, as: 'requester' },
        { model: User, as: 'technician' },
      ],
    });

    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }

    return successResponse(
      'Work order fetched successfully',
      transformWorkOrder(workOrder),
    );
  }

  async update(id: number, dto: UpdateWorkOrderDto, userId: number) {
    const workOrder = await this.findOneRaw(id);

    // Validate foreign key constraints for updates
    await this.validateForeignKeys(dto);

    // Additional validation: Check if location belongs to client (if both are being updated)
    if (dto.client_id && dto.location_id) {
      await this.validateLocationBelongsToClient(
        dto.client_id,
        dto.location_id,
      );
    } else if (dto.location_id && !dto.client_id) {
      // If only location is being updated, validate against existing client
      await this.validateLocationBelongsToClient(
        workOrder.client_id,
        dto.location_id,
      );
    }

    // Validate status transitions
    // if (dto.status && dto.status !== workOrder.status) {
    //   this.validateStatusTransition(workOrder.status, dto.status);
    // }

    // Validate SLA due date
    if (dto.sla_due_at) {
      const slaDate = new Date(dto.sla_due_at);
      if (slaDate <= new Date()) {
        throw new BadRequestException('SLA due date must be in the future');
      }
    }

    // Validate feedback rating
    if (dto.feedback_rating !== undefined) {
      if (dto.feedback_rating < 1 || dto.feedback_rating > 5) {
        throw new BadRequestException(
          'Feedback rating must be between 1 and 5',
        );
      }
    }

    // Auto-set completion timestamp when status changes to COMPLETED
    if (dto.status === WorkOrderStatus.COMPLETED && !dto.completed_at) {
      dto.completed_at = new Date().toISOString();
    }

    // Auto-set diagnosis timestamp when status changes to DIAGNOSED
    if (dto.status === WorkOrderStatus.DIAGNOSED && !dto.diagnosis_timestamp) {
      dto.diagnosis_timestamp = new Date().toISOString();
    }

    // Remove empty strings
    Object.keys(dto).forEach((key) => {
      if (dto[key] === '') delete dto[key];
    });

    // Regenerate work order code if client or location changes
    if (dto.client_id || dto.location_id) {
      const newClientId = dto.client_id || workOrder.client_id;
      const newLocationId = dto.location_id || workOrder.location_id;
      dto.work_order_code = await this.generateWorkOrderCode(
        newClientId,
        newLocationId,
        workOrder.id,
      );
    }

    (dto as any).updated_by = userId;

    await workOrder.update(dto as any);

    return successResponse(
      'Work order updated successfully',
      transformWorkOrder(await this.findOneRaw(id)),
    );
  }

  async remove(id: number) {
    const workOrder = await this.findOneRaw(id);

    // Check if work order can be deleted (only if status is REQUESTED or CANCELLED)
    // if (
    //   ![WorkOrderStatus.REQUESTED, WorkOrderStatus.CANCELLED].includes(
    //     workOrder.status,
    //   )
    // ) {
    //   throw new BadRequestException(
    //     'Cannot delete work order in current status. Only REQUESTED or CANCELLED work orders can be deleted.',
    //   );
    // }

    await workOrder.destroy();
    return successResponse('Work order deleted successfully');
  }

  // Private helper methods

  private async findOneRaw(id: number): Promise<WorkOrderEntity> {
    const workOrder = await this.workOrderModel.findByPk(id);
    if (!workOrder) {
      throw new NotFoundException('Work order not found');
    }
    return workOrder;
  }

  private validateCreateDto(dto: CreateWorkOrderDto) {
    const errors: string[] = [];

    if (!dto.client_id) {
      errors.push('Client ID is required');
    }
    if (!dto.location_id) {
      errors.push('Location ID is required');
    }
    if (!dto.contact_person?.trim()) {
      errors.push('Contact person is required');
    }
    if (!dto.contact_number?.trim()) {
      errors.push('Contact number is required');
    }
    if (!dto.requested_by) {
      errors.push('Requested by user ID is required');
    }
    if (!dto.sla_due_at) {
      errors.push('SLA due date is required');
    }
    if (dto.request_type === undefined || dto.request_type === null) {
      errors.push('Request type is required');
    }
    if (!dto.priority) {
      errors.push('Priority is required');
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors,
      });
    }
  }

  private async validateForeignKeys(
    dto: CreateWorkOrderDto | UpdateWorkOrderDto,
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

  private validateStatusTransition(
    currentStatus: WorkOrderStatus,
    newStatus: WorkOrderStatus,
  ) {
    const validTransitions: Record<WorkOrderStatus, WorkOrderStatus[]> = {
      [WorkOrderStatus.REQUESTED]: [
        WorkOrderStatus.DIAGNOSED,
        WorkOrderStatus.IN_PROGRESS,
        WorkOrderStatus.CANCELLED,
      ],
      [WorkOrderStatus.DIAGNOSED]: [
        WorkOrderStatus.IN_PROGRESS,
        WorkOrderStatus.CANCELLED,
      ],
      [WorkOrderStatus.IN_PROGRESS]: [
        WorkOrderStatus.COMPLETED,
        WorkOrderStatus.REWORK,
        WorkOrderStatus.CANCELLED,
      ],
      [WorkOrderStatus.COMPLETED]: [
        WorkOrderStatus.WARRANTY,
        WorkOrderStatus.REWORK,
      ],
      [WorkOrderStatus.CANCELLED]: [],
      [WorkOrderStatus.REWORK]: [
        WorkOrderStatus.IN_PROGRESS,
        WorkOrderStatus.COMPLETED,
        WorkOrderStatus.CANCELLED,
      ],
      [WorkOrderStatus.WARRANTY]: [
        WorkOrderStatus.COMPLETED,
        WorkOrderStatus.IN_PROGRESS,
      ],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  private async generateWorkOrderCode(
    clientId: number,
    locationId: number,
    recordId: number,
  ): Promise<string> {
    // Get client code
    const client = await this.clientModel.findByPk(clientId);
    if (!client || !client.client_code) {
      throw new BadRequestException(
        'Client code not found for generating work order code',
      );
    }

    // Format: WO-ClientCode-LocationID-RecordID
    return `WO-${client.client_code}-${locationId}-${recordId}`;
  }

  private async buildAdvancedFilters(
    filterDto: WorkOrderFilterDto,
  ): Promise<WhereOptions<WorkOrderEntity>> {
    const where: WhereOptions<WorkOrderEntity> = {};
    const { request_type, priority, status, reopened_as_warranty, searchTerm } =
      filterDto;

    // Search functionality
    if (searchTerm) {
      where[Op.or] = [
        { work_order_code: { [Op.like]: `%${searchTerm}%` } },
        { contact_person: { [Op.like]: `%${searchTerm}%` } },
        { contact_number: { [Op.like]: `%${searchTerm}%` } },
        { feedback_comments: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    // Specific filters
    if (request_type !== undefined) {
      where.request_type = request_type;
    }

    if (priority !== undefined) {
      where.priority = priority;
    }

    if (status !== undefined) {
      where.status = status;
    }

    if (reopened_as_warranty !== undefined) {
      where.reopened_as_warranty = reopened_as_warranty;
    }

    return where;
  }

  // Summary and analytics methods
  async getWorkOrderSummary() {
    const total = await this.workOrderModel.count();

    const statusCounts = await Promise.all(
      Object.values(WorkOrderStatus).map(async (status) => ({
        status,
        count: await this.workOrderModel.count({ where: { status } }),
      })),
    );

    const priorityCounts = await Promise.all(
      Object.values(WorkOrderPriority).map(async (priority) => ({
        priority,
        count: await this.workOrderModel.count({ where: { priority } }),
      })),
    );

    // Overdue work orders
    const overdue = await this.workOrderModel.count({
      where: {
        sla_due_at: { [Op.lt]: new Date() },
        status: {
          [Op.notIn]: [WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELLED],
        },
      },
    });

    // Due soon (next 24 hours)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueSoon = await this.workOrderModel.count({
      where: {
        sla_due_at: {
          [Op.gte]: new Date(),
          [Op.lte]: tomorrow,
        },
        status: {
          [Op.notIn]: [WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELLED],
        },
      },
    });

    return successResponse('Work order summary fetched successfully', {
      total,
      statusCounts,
      priorityCounts,
      overdue,
      dueSoon,
    });
  }

  async getWorkOrdersByStatus(status: WorkOrderStatus) {
    const workOrders = await this.workOrderModel.findAll({
      where: { status },
      include: [
        { model: ClientEntity, as: 'client' },
        { model: ClientLocationEntity, as: 'location' },
        { model: User, as: 'requester' },
        { model: User, as: 'technician' },
      ],
      order: [['id', 'DESC']],
    });

    const transformedWorkOrders = workOrders.map((workOrder) =>
      transformWorkOrder(workOrder),
    );

    return successResponse(
      `Work orders with status ${status} fetched successfully`,
      transformedWorkOrders,
    );
  }
  async assignTechnician(
    workOrderId: number,
    technicianId: number,
    userId: number,
  ) {
    const workOrder = await this.findOneRaw(workOrderId);

    if (workOrder.status === WorkOrderStatus.COMPLETED) {
      throw new BadRequestException(
        'Cannot assign technician to completed work order',
      );
    }

    // Validate technician exists
    const technician = await this.userModel.findByPk(technicianId);
    if (!technician) {
      throw new BadRequestException(
        `Technician with ID ${technicianId} does not exist`,
      );
    }

    await workOrder.update({
      assigned_technician: technicianId,
      // updated_by: userId,
    });

    return successResponse(
      'Technician assigned successfully',
      transformWorkOrder(await this.findOneRaw(workOrderId)),
    );
  }
}
