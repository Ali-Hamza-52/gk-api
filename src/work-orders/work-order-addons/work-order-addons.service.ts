// src/work-orders/work-order-addons/work-order-addons.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkOrderAddon } from './entities/work-order-addon.entity';
import { WorkOrder } from '@/work-orders/entities/work-orders.entity';
import { User } from '@/users/user.entity';
import { CreateWorkOrderAddonDto } from './dto/create-work-order-addon.dto';
import { UpdateWorkOrderAddonDto } from './dto/update-work-order-addon.dto';
import { FilterWorkOrderAddonDto } from './dto/filter-work-order-addon.dto';
import { Op, WhereOptions } from 'sequelize';
import { paginateQuery } from '@/common/utils/db-pagination';
import { successResponse } from '@/common/utils/response';
import { PermissionService } from '@/permissions/permission.service';
import { applyOwnershipFilter } from '@/common/utils/permission-filter';

interface FilterParams extends FilterWorkOrderAddonDto {
  userId?: number;
  roleId?: number;
}

@Injectable()
export class WorkOrderAddonsService {
  constructor(
    @InjectModel(WorkOrderAddon)
    private readonly workOrderAddonModel: typeof WorkOrderAddon,
    @InjectModel(WorkOrder)
    private readonly workOrderModel: typeof WorkOrder,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly permissionService: PermissionService,
  ) {}

  async create(dto: CreateWorkOrderAddonDto, userId: number) {
    // Validate foreign keys
    await this.validateForeignKeys(dto);

    const payload: any = {
      work_order_id: dto.work_order_id,
      addon_type: dto.addon_type,
      description: dto.description,
      price: dto.price,
      approved_by_client: dto.approved_by_client ?? false,
      approved_by_userid: dto.approved_by_userid ?? null,
      approved_date: dto.approved_date ? new Date(dto.approved_date) : null,
      created_by: userId,
      updated_by: userId,
    };

    const workOrderAddon = await this.workOrderAddonModel.create(payload);

    return successResponse('Work order addon created successfully', {
      id: workOrderAddon.id,
      work_order_id: workOrderAddon.work_order_id,
      addon_type: workOrderAddon.addon_type,
      description: workOrderAddon.description,
      price: workOrderAddon.price,
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

    let where: WhereOptions<WorkOrderAddon> = {};

    // Apply ownership filter
    if (userId && roleId) {
      const hasViewAll = await this.permissionService.hasViewAllPermission(
        roleId,
        'work_orders',
      );
      where = applyOwnershipFilter(where, {
        userId,
        roleId,
        module: 'work_order_addons',
        hasViewAll,
      }) as WhereOptions<WorkOrderAddon>;
    }

    // Search functionality
    if (searchTerm) {
      const searchFilter: WhereOptions<WorkOrderAddon> = {
        [Op.or]: [
          // Search by numeric fields if searchTerm is a number
          ...(isNaN(Number(searchTerm))
            ? []
            : [
                { id: Number(searchTerm) },
                { work_order_id: Number(searchTerm) },
              ]),
          // Search by description
          { description: { [Op.like]: `%${searchTerm}%` } },
          // Search by work order code in related table
          { '$workOrder.work_order_code$': { [Op.like]: `%${searchTerm}%` } },
        ],
      };

      if (where[Op.and]) {
        (where[Op.and] as WhereOptions<WorkOrderAddon>[]).push(searchFilter);
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
      // Skip if value is undefined or null
      // For addon_type enum, all valid enum values should be processed
      if (value === undefined || value === null) {
        continue;
      }

      const filterCondition: WhereOptions<WorkOrderAddon> = {
        [key]: value,
      } as WhereOptions<WorkOrderAddon>;

      if (where[Op.and]) {
        (where[Op.and] as WhereOptions<WorkOrderAddon>[]).push(filterCondition);
      } else if (Object.keys(where).length > 0) {
        where = {
          [Op.and]: [where, filterCondition],
        };
      } else {
        where = filterCondition;
      }
    }

    const result = await paginateQuery(this.workOrderAddonModel, {
      where,
      include: [
        {
          model: this.workOrderModel,
          as: 'workOrder',
          attributes: ['id', 'work_order_code'],
          required: false,
        },
        {
          model: this.userModel,
          as: 'approvedByUser',
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
      order: [['created_at', 'DESC']],
      page,
      perPage,
    });

    return successResponse('Work order addons fetched successfully', result);
  }
  async findOne(id: number) {
    const record = await this.workOrderAddonModel.findByPk(id, {
      include: [
        {
          model: this.workOrderModel,
          as: 'workOrder',
          attributes: ['id', 'work_order_code', 'status'],
          required: false,
        },
        {
          model: this.userModel,
          as: 'approvedByUser',
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
      throw new NotFoundException('Work order addon not found');
    }

    return successResponse('Work order addon fetched successfully', record);
  }

  async update(
    id: number,
    dto: UpdateWorkOrderAddonDto | Partial<UpdateWorkOrderAddonDto>,
    userId: number,
  ) {
    const record = await this.workOrderAddonModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Work order addon not found');
    }

    // Validate foreign keys if they are being updated
    await this.validateForeignKeys(dto);

    const updatePayload: any = {
      updated_by: userId,
      updated_at: new Date(),
    };

    // Map all fields with proper null handling
    this.mapUpdateFields(dto, updatePayload);

    await record.update(updatePayload);

    return successResponse('Work order addon updated successfully', {
      id: record.id,
      work_order_id: record.work_order_id,
      addon_type: record.addon_type,
      description: record.description,
      price: record.price,
      updated_at: updatePayload.updated_at,
    });
  }

  async partialUpdate(
    id: number,
    dto: Partial<UpdateWorkOrderAddonDto>,
    userId: number,
  ) {
    const record = await this.workOrderAddonModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Work order addon not found');
    }

    // Validate foreign keys if they are being updated
    await this.validateForeignKeys(dto);

    const updatePayload: any = {
      updated_by: userId,
      updated_at: new Date(),
    };

    // Map only provided fields (partial update)
    this.mapUpdateFields(dto, updatePayload);

    await record.update(updatePayload);

    return successResponse('Work order addon partially updated successfully', {
      id: record.id,
      work_order_id: record.work_order_id,
      addon_type: record.addon_type,
      description: record.description,
      price: record.price,
      updated_at: updatePayload.updated_at,
    });
  }

  async remove(id: number) {
    const record = await this.workOrderAddonModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Work order addon not found');
    }

    await record.destroy();

    return successResponse('Work order addon deleted successfully', {
      id,
      price: record.price,
    });
  }

  async getSummary() {
    // Get total counts and values
    const totalAddons = await this.workOrderAddonModel.count();

    // Approved addons summary
    const approvedAddonsCount = await this.workOrderAddonModel.count({
      where: { approved_by_client: true },
    });

    const approvedAddonsValue =
      (await this.workOrderAddonModel.sum('price', {
        where: { approved_by_client: true },
      })) || 0;

    // Unapproved addons summary
    const unapprovedAddonsCount = await this.workOrderAddonModel.count({
      where: { approved_by_client: false },
    });

    const unapprovedAddonsValue =
      (await this.workOrderAddonModel.sum('price', {
        where: { approved_by_client: false },
      })) || 0;

    // Total value
    const totalValue = (await this.workOrderAddonModel.sum('price')) || 0;

    return successResponse('Work order addons summary fetched successfully', {
      totalAddons,
      totalValue: Number(totalValue.toFixed(2)),
      approvedAddons: {
        count: approvedAddonsCount,
        totalValue: Number(approvedAddonsValue.toFixed(2)),
      },
      unapprovedAddons: {
        count: unapprovedAddonsCount,
        totalValue: Number(unapprovedAddonsValue.toFixed(2)),
      },
    });
  }

  async getDropdownOptions() {
    // Get work orders for dropdown
    const workOrders = await this.workOrderModel.findAll({
      attributes: ['id', 'work_order_code'],
      order: [['id', 'DESC']],
      limit: 100,
      raw: true,
    });

    const workOrderOptions = workOrders.map((wo) => ({
      id: wo.id,
      work_order_code: wo.work_order_code,
    }));

    return successResponse('Dropdown options fetched successfully', {
      workOrders: workOrderOptions,
    });
  }

  // Private helper methods
  private async validateForeignKeys(
    dto:
      | CreateWorkOrderAddonDto
      | UpdateWorkOrderAddonDto
      | Partial<UpdateWorkOrderAddonDto>,
  ) {
    const errors: string[] = [];

    // Validate work_order_id
    if (dto.work_order_id) {
      const workOrder = await this.workOrderModel.findByPk(dto.work_order_id);
      if (!workOrder) {
        errors.push(`Work order with ID ${dto.work_order_id} does not exist`);
      }
    }

    // Validate approved_by_userid
    if (dto.approved_by_userid) {
      const user = await this.userModel.findByPk(dto.approved_by_userid);
      if (!user) {
        errors.push(`User with ID ${dto.approved_by_userid} does not exist`);
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Foreign key validation failed',
        errors: errors,
      });
    }
  }

  private mapUpdateFields(
    dto: UpdateWorkOrderAddonDto | Partial<UpdateWorkOrderAddonDto>,
    updatePayload: any,
  ) {
    // Map numeric fields (handle 0 as valid value)
    if (dto.work_order_id !== undefined) {
      updatePayload.work_order_id = dto.work_order_id ?? null;
    }
    if (dto.price !== undefined) {
      updatePayload.price = dto.price ?? null;
    }
    if (dto.approved_by_userid !== undefined) {
      updatePayload.approved_by_userid = dto.approved_by_userid ?? null;
    }

    // Map string fields
    if (dto.addon_type !== undefined) {
      updatePayload.addon_type = dto.addon_type || null;
    }
    if (dto.description !== undefined) {
      updatePayload.description = dto.description || null;
    }

    // Map boolean fields
    if (dto.approved_by_client !== undefined) {
      updatePayload.approved_by_client = dto.approved_by_client ?? false;
    }

    // Convert date strings to Date objects
    if (dto.approved_date !== undefined) {
      updatePayload.approved_date = dto.approved_date
        ? new Date(dto.approved_date)
        : null;
    }
  }
}
