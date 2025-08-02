// src/work-order-services/work-order-services.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  WorkOrderService,
  TaskStatus,
} from './entities/work-order-service.entity';
import { WorkOrder } from '@/work-orders/entities/work-orders.entity';
import { FmServiceSettings } from '@/settings/fm-service-settings/fm-service-settings.entity';
import { User } from '@/users/user.entity';
import { CreateWorkOrderServiceDto } from './dto/create-work-order-service.dto';
import { UpdateWorkOrderServiceDto } from './dto/update-work-order-service.dto';
import { FilterWorkOrderServiceDto } from './dto/filter-work-order-service.dto';
import { Op } from 'sequelize';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { successResponse } from '@/common/utils/response';
import { PermissionService } from '@/permissions/permission.service';
import { applyOwnershipFilter } from '@/common/utils/permission-filter';

@Injectable()
export class WorkOrderServicesService {
  constructor(
    @InjectModel(WorkOrderService)
    private readonly workOrderServiceModel: typeof WorkOrderService,
    @InjectModel(WorkOrder)
    private readonly workOrderModel: typeof WorkOrder,
    @InjectModel(FmServiceSettings)
    private readonly serviceModel: typeof FmServiceSettings,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private permissionService: PermissionService,
  ) {}

  async create(dto: CreateWorkOrderServiceDto, userId: number) {
    // Validate work order exists
    const workOrder = await this.workOrderModel.findByPk(dto.work_order_id);
    if (!workOrder) {
      throw new BadRequestException('Work order does not exist');
    }

    // Validate service exists
    const service = await this.serviceModel.findByPk(dto.service_id_link);
    if (!service) {
      throw new BadRequestException(
        `Id: ${dto.service_id_link} Service does not exist`,
      );
    }

    // Validate approver user exists if provided
    if (dto.approved_by_userid) {
      const user = await this.userModel.findByPk(dto.approved_by_userid);
      if (!user) {
        throw new BadRequestException('Approver user does not exist');
      }
    }

    const payload = {
      work_order_id: dto.work_order_id,
      service_id_link: dto.service_id_link,
      task_status: dto.task_status || TaskStatus.REQUESTED,
      approved_by_client: dto.approved_by_client || false,
      approved_by_userid: dto.approved_by_userid || null,
      approved_date: dto.approved_date ? new Date(dto.approved_date) : null,
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.workOrderServiceModel.create(payload as any);
    return successResponse('Work order service created successfully');
  }

  async findAll(
    filterDto: FilterWorkOrderServiceDto & {
      userId?: number;
      roleId?: number;
    },
  ) {
    const {
      page = 1,
      perPage = 10,
      searchTerm,
      userId,
      roleId,
      work_order_id,
      service_id_link,
      task_status,
      approved_by_userid,
    } = filterDto;

    let where: any = {};

    // Apply ownership filter if needed
    if (userId && roleId) {
      const hasViewAll = await this.permissionService.hasViewAllPermission(
        roleId,
        'work_order_services',
      );
      where = applyOwnershipFilter(where, {
        userId,
        roleId,
        module: 'work_order_services',
        hasViewAll,
      });
    }

    // Search functionality
    if (searchTerm) {
      const searchConditions: any[] = [];

      // If searchTerm is numeric, search by ID and work_order_id
      if (!isNaN(Number(searchTerm))) {
        searchConditions.push({ id: Number(searchTerm) });
        searchConditions.push({ work_order_id: Number(searchTerm) });
      }

      // Search by service name in related table
      searchConditions.push({
        '$service.task_name$': { [Op.like]: `%${searchTerm}%` },
      });

      // Combine search conditions with existing where clause
      if (Object.keys(where).length > 0) {
        where = {
          [Op.and]: [where, { [Op.or]: searchConditions }],
        };
      } else {
        where[Op.or] = searchConditions;
      }
    }

    // Apply additional filters
    const additionalFilters: any = {};

    if (work_order_id) {
      additionalFilters.work_order_id = work_order_id;
    }
    if (service_id_link) {
      additionalFilters.service_id_link = service_id_link;
    }
    if (task_status) {
      additionalFilters.task_status = task_status;
    }
    if (approved_by_userid) {
      additionalFilters.approved_by_userid = approved_by_userid;
    }

    // Combine additional filters with existing where clause
    if (Object.keys(additionalFilters).length > 0) {
      if (Object.keys(where).length > 0) {
        where = {
          [Op.and]: [where, additionalFilters],
        };
      } else {
        where = additionalFilters;
      }
    }

    const result = await paginateQuery(this.workOrderServiceModel, {
      where,
      include: [
        {
          model: this.workOrderModel,
          as: 'workOrder',
          attributes: ['id', 'work_order_code'],
          required: false,
        },
        {
          model: this.serviceModel,
          as: 'service',
          attributes: ['id', 'task_name', 'category'],
          required: false,
        },
        {
          model: this.userModel,
          as: 'approvedByUser',
          attributes: ['id', 'name'],
          required: false,
        },
      ],
      order: [['id', 'DESC']],
      page,
      perPage,
    });

    return successResponse('Work order services fetched successfully', result);
  }

  async findOne(id: number) {
    const record = await this.workOrderServiceModel.findByPk(id, {
      include: [
        {
          model: this.workOrderModel,
          as: 'workOrder',
          attributes: ['id', 'work_order_code'],
        },
        {
          model: this.serviceModel,
          as: 'service',
          attributes: ['id', 'task_name', 'category'],
        },
        {
          model: this.userModel,
          as: 'approvedByUser',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!record) {
      throw new NotFoundException('Work order service not found');
    }

    return successResponse('Work order service fetched successfully', record);
  }

  async update(id: number, dto: UpdateWorkOrderServiceDto, userId: number) {
    const record = await this.workOrderServiceModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Work order service not found');
    }

    // Validate work order exists if being updated
    if (dto.work_order_id) {
      const workOrder = await this.workOrderModel.findByPk(dto.work_order_id);
      if (!workOrder) {
        throw new BadRequestException('Work order does not exist');
      }
    }

    // Validate service exists if being updated
    if (dto.service_id_link) {
      const service = await this.serviceModel.findByPk(dto.service_id_link);
      if (!service) {
        throw new BadRequestException('Service does not exist');
      }
    }

    // Validate approver user exists if being updated
    if (dto.approved_by_userid) {
      const user = await this.userModel.findByPk(dto.approved_by_userid);
      if (!user) {
        throw new BadRequestException('Approver user does not exist');
      }
    }

    const payload = {
      ...dto,
      approved_date: dto.approved_date
        ? new Date(dto.approved_date)
        : undefined,
      updatedBy: userId,
      updatedAt: new Date(),
    };

    await record.update(payload);
    return successResponse('Work order service updated successfully');
  }

  async remove(id: number) {
    const record = await this.workOrderServiceModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Work order service not found');
    }

    await record.destroy();
    return successResponse('Work order service deleted successfully');
  }

  async partialUpdate(
    id: number,
    dto: Partial<UpdateWorkOrderServiceDto>,
    userId: number,
  ) {
    const record = await this.workOrderServiceModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Work order service not found');
    }

    // Validate work order exists if being updated
    if (dto.work_order_id) {
      const workOrder = await this.workOrderModel.findByPk(dto.work_order_id);
      if (!workOrder) {
        throw new BadRequestException('Work order does not exist');
      }
    }

    // Validate service exists if being updated
    if (dto.service_id_link) {
      const service = await this.serviceModel.findByPk(dto.service_id_link);
      if (!service) {
        throw new BadRequestException('Service does not exist');
      }
    }

    // Validate approver user exists if being updated
    if (dto.approved_by_userid) {
      const user = await this.userModel.findByPk(dto.approved_by_userid);
      if (!user) {
        throw new BadRequestException('Approver user does not exist');
      }
    }

    const payload = {
      ...dto,
      approved_date: dto.approved_date
        ? new Date(dto.approved_date)
        : undefined,
      updatedBy: userId,
      updatedAt: new Date(),
    };

    await record.update(payload);
    return successResponse('Work order service updated successfully');
  }

  async getSummary() {
    const totalServices = await this.workOrderServiceModel.count();

    const statusCounts = await Promise.all(
      Object.values(TaskStatus).map(async (status) => {
        const count = await this.workOrderServiceModel.count({
          where: { task_status: status },
        });
        return { status, count };
      }),
    );

    const approvedCount = await this.workOrderServiceModel.count({
      where: { approved_by_client: true },
    });

    const pendingApprovalCount = await this.workOrderServiceModel.count({
      where: { approved_by_client: false },
    });

    return successResponse('Summary fetched successfully', {
      totalServices,
      statusCounts,
      approvedCount,
      pendingApprovalCount,
    });
  }

  async getDropdownOptions() {
    // Get work orders for dropdown
    const workOrders = await this.workOrderModel.findAll({
      attributes: ['id', 'work_order_code'],
      order: [['id', 'DESC']],
      raw: true,
    });

    // Get services for dropdown
    const services = await this.serviceModel.findAll({
      attributes: ['id', 'task_name', 'category'],
      order: [['task_name', 'ASC']],
      raw: true,
    });

    const workOrderOptions = workOrders.map((wo) => ({
      id: wo.id,
      work_order_code: `${wo.work_order_code}`,
    }));

    const serviceOptions = services.map((service) => ({
      id: service.id,
      task_name: service.task_name,
      category: service.category,
    }));

    return successResponse('Dropdown options fetched successfully', {
      workOrders: workOrderOptions,
      services: serviceOptions,
      taskStatuses: Object.values(TaskStatus),
    });
  }
}
