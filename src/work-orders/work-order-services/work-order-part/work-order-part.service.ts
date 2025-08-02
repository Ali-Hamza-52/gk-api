// src/work-orders/work-order-parts/work-order-parts.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkOrderPart } from './entities/work-order-part.entity';
import { WorkOrder } from '@/work-orders/entities/work-orders.entity';
import { WorkOrderService } from '@/work-orders/work-order-services/entities/work-order-service.entity';
import { MaterialEntity } from '@/settings/materials/entities/material.entity';
import { SupplierEntity } from '@/purchasing/suppliers/entities/supplier.entity';
import { User } from '@/users/user.entity';
import { CreateWorkOrderPartDto } from './dto/create-work-order-part.dto';
import { UpdateWorkOrderPartDto } from './dto/update-work-order-part.dto';
import { FilterWorkOrderPartDto } from './dto/filter-work-order-part.dto';
import { Op, WhereOptions } from 'sequelize';
import { paginateQuery } from '@/common/utils/db-pagination';
import { successResponse } from '@/common/utils/response';
import { PermissionService } from '@/permissions/permission.service';
import { applyOwnershipFilter } from '@/common/utils/permission-filter';

interface FilterParams extends FilterWorkOrderPartDto {
  userId?: number;
  roleId?: number;
}

@Injectable()
export class WorkOrderPartsService {
  constructor(
    @InjectModel(WorkOrderPart)
    private readonly workOrderPartModel: typeof WorkOrderPart,
    @InjectModel(WorkOrder)
    private readonly workOrderModel: typeof WorkOrder,
    @InjectModel(WorkOrderService)
    private readonly workOrderServiceModel: typeof WorkOrderService,
    @InjectModel(MaterialEntity)
    private readonly materialModel: typeof MaterialEntity,
    @InjectModel(SupplierEntity)
    private readonly supplierModel: typeof SupplierEntity,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly permissionService: PermissionService,
  ) {}

  async create(dto: CreateWorkOrderPartDto, userId: number) {
    // Validate foreign keys
    await this.validateForeignKeys(dto);

    // Validate work order service belongs to work order
    await this.validateWorkOrderServiceBelongsToWorkOrder(
      dto.work_order_id,
      dto.work_order_service_id,
    );

    const payload: any = {
      work_order_id: dto.work_order_id,
      work_order_service_id: dto.work_order_service_id,
      part_id: dto.part_id,
      quantity: dto.quantity,
      unit_price: dto.unit_price,
      warranty_duration: dto.warranty_duration ?? 0,
      supplier_id: dto.supplier_id ?? null,
      approved_by_client: dto.approved_by_client ?? false,
      approved_by_userid: dto.approved_by_userid ?? null,
      approved_date: dto.approved_date ? new Date(dto.approved_date) : null,
      created_by: userId,
      updated_by: userId,
    };

    // Calculate total_price using helper function
    payload.total_price = this.calculateTotalPrice(
      payload.quantity,
      payload.unit_price,
    );

    const workOrderPart = await this.workOrderPartModel.create(payload);

    return successResponse('Work order part created successfully', {
      id: workOrderPart.id,
      work_order_id: workOrderPart.work_order_id,
      work_order_service_id: workOrderPart.work_order_service_id,
      part_id: workOrderPart.part_id,
      quantity: workOrderPart.quantity,
      unit_price: workOrderPart.unit_price,
      total_price: workOrderPart.total_price,
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

    let where: WhereOptions<WorkOrderPart> = {};

    // Apply ownership filter
    if (userId && roleId) {
      const hasViewAll = await this.permissionService.hasViewAllPermission(
        roleId,
        'work_orders',
      );
      where = applyOwnershipFilter(where, {
        userId,
        roleId,
        module: 'work_order_parts',
        hasViewAll,
      }) as WhereOptions<WorkOrderPart>;
    }

    // Search functionality
    if (searchTerm) {
      const searchFilter: WhereOptions<WorkOrderPart> = {
        [Op.or]: [
          // Search by numeric fields if searchTerm is a number
          ...(isNaN(Number(searchTerm))
            ? []
            : [
                { id: Number(searchTerm) },
                { work_order_id: Number(searchTerm) },
                { work_order_service_id: Number(searchTerm) },
                { part_id: Number(searchTerm) },
              ]),
          // Search by material name in related table
          { '$material.material_name$': { [Op.like]: `%${searchTerm}%` } },
          // Search by work order code in related table
          { '$workOrder.work_order_code$': { [Op.like]: `%${searchTerm}%` } },
          // Search by supplier name if exists
          { '$supplier.supplier_name$': { [Op.like]: `%${searchTerm}%` } },
        ],
      };

      if (where[Op.and]) {
        (where[Op.and] as WhereOptions<WorkOrderPart>[]).push(searchFilter);
      } else if (Object.keys(where).length > 0) {
        where = {
          [Op.and]: [where, searchFilter],
        };
      } else {
        where = searchFilter;
      }
    }

    // Apply range filters
    const rangeFilters: WhereOptions<WorkOrderPart> = {}
    // Combine range filters with existing where clause
    if (Object.keys(rangeFilters).length > 0) {
      if (where[Op.and]) {
        (where[Op.and] as WhereOptions<WorkOrderPart>[]).push(rangeFilters);
      } else if (Object.keys(where).length > 0) {
        where = {
          [Op.and]: [where, rangeFilters],
        };
      } else {
        where = rangeFilters;
      }
    }

    // Apply remaining filters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== 0) {
        const filterCondition: WhereOptions<WorkOrderPart> = {
          [key]: value,
        } as WhereOptions<WorkOrderPart>;

        if (where[Op.and]) {
          (where[Op.and] as WhereOptions<WorkOrderPart>[]).push(
            filterCondition,
          );
        } else if (Object.keys(where).length > 0) {
          where = {
            [Op.and]: [where, filterCondition],
          };
        } else {
          where = filterCondition;
        }
      }
    }

    const result = await paginateQuery(this.workOrderPartModel, {
      where,
      include: [
        {
          model: this.workOrderModel,
          as: 'workOrder',
          attributes: ['id', 'work_order_code'],
          required: false,
        },
        {
          model: this.workOrderServiceModel,
          as: 'workOrderService',
          attributes: ['id', 'task_status'],
          required: false,
        },
        {
          model: this.materialModel,
          as: 'material',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: this.supplierModel,
          as: 'supplier',
          attributes: ['id', 'name'],
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

    return successResponse('Work order parts fetched successfully', result);
  }

  async findOne(id: number) {
    const record = await this.workOrderPartModel.findByPk(id, {
      include: [
        {
          model: this.workOrderModel,
          as: 'workOrder',
          attributes: ['id', 'work_order_code', 'status'],
          required: false,
        },
        {
          model: this.workOrderServiceModel,
          as: 'workOrderService',
          attributes: ['id', 'task_status'],
          required: false,
        },
        {
          model: this.materialModel,
          as: 'material',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: this.supplierModel,
          as: 'supplier',
          attributes: ['id', 'name'],
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
      throw new NotFoundException('Work order part not found');
    }

    return successResponse('Work order part fetched successfully', record);
  }

  async update(
    id: number,
    dto: UpdateWorkOrderPartDto | Partial<UpdateWorkOrderPartDto>,
    userId: number,
  ) {
    const record = await this.workOrderPartModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Work order part not found');
    }

    // Validate foreign keys if they are being updated
    await this.validateForeignKeys(dto);

    // Validate work order service belongs to work order if either is being updated
    const workOrderId = dto.work_order_id ?? record.work_order_id;
    const workOrderServiceId =
      dto.work_order_service_id ?? record.work_order_service_id;
    await this.validateWorkOrderServiceBelongsToWorkOrder(
      workOrderId,
      workOrderServiceId,
    );

    const updatePayload: any = {
      updated_by: userId,
      updated_at: new Date(),
    };

    // Map all fields with proper null handling
    this.mapUpdateFields(dto, updatePayload);

    // Recalculate total_price if quantity or unit_price changed
    if (dto.quantity !== undefined || dto.unit_price !== undefined) {
      const finalQuantity = dto.quantity ?? record.quantity;
      const finalUnitPrice = dto.unit_price ?? record.unit_price;
      updatePayload.total_price = this.calculateTotalPrice(
        finalQuantity,
        finalUnitPrice,
      );
    }

    await record.update(updatePayload);

    return successResponse('Work order part updated successfully', {
      id: record.id,
      work_order_id: record.work_order_id,
      work_order_service_id: record.work_order_service_id,
      part_id: record.part_id,
      quantity: record.quantity,
      unit_price: record.unit_price,
      total_price: record.total_price,
      updated_at: updatePayload.updated_at,
    });
  }

  async partialUpdate(
    id: number,
    dto: Partial<UpdateWorkOrderPartDto>,
    userId: number,
  ) {
    const record = await this.workOrderPartModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Work order part not found');
    }

    // Validate foreign keys if they are being updated
    await this.validateForeignKeys(dto);

    // Validate work order service belongs to work order if either is being updated
    const workOrderId = dto.work_order_id ?? record.work_order_id;
    const workOrderServiceId =
      dto.work_order_service_id ?? record.work_order_service_id;
    await this.validateWorkOrderServiceBelongsToWorkOrder(
      workOrderId,
      workOrderServiceId,
    );

    const updatePayload: any = {
      updated_by: userId,
      updated_at: new Date(),
    };

    // Map only provided fields (partial update)
    this.mapUpdateFields(dto, updatePayload);

    // Recalculate total_price if quantity or unit_price changed
    if (dto.quantity !== undefined || dto.unit_price !== undefined) {
      const finalQuantity = dto.quantity ?? record.quantity;
      const finalUnitPrice = dto.unit_price ?? record.unit_price;
      updatePayload.total_price = this.calculateTotalPrice(
        finalQuantity,
        finalUnitPrice,
      );
    }

    await record.update(updatePayload);

    return successResponse('Work order part partially updated successfully', {
      id: record.id,
      work_order_id: record.work_order_id,
      work_order_service_id: record.work_order_service_id,
      part_id: record.part_id,
      quantity: record.quantity,
      unit_price: record.unit_price,
      total_price: record.total_price,
      updated_at: updatePayload.updated_at,
    });
  }

  async remove(id: number) {
    const record = await this.workOrderPartModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Work order part not found');
    }

    await record.destroy();

    return successResponse('Work order part deleted successfully', {
      id,
      total_price: record.total_price,
    });
  }

  async getSummary() {
    // Get total counts and values
    const totalParts = await this.workOrderPartModel.count();

    // Approved parts summary
    const approvedPartsCount = await this.workOrderPartModel.count({
      where: { approved_by_client: true },
    });

    const approvedPartsValue =
      (await this.workOrderPartModel.sum('total_price', {
        where: { approved_by_client: true },
      })) || 0;

    // Unapproved parts summary
    const unapprovedPartsCount = await this.workOrderPartModel.count({
      where: { approved_by_client: false },
    });

    const unapprovedPartsValue =
      (await this.workOrderPartModel.sum('total_price', {
        where: { approved_by_client: false },
      })) || 0;

    // Total value
    const totalValue = (await this.workOrderPartModel.sum('total_price')) || 0;

    return successResponse('Work order parts summary fetched successfully', {
      totalParts,
      totalValue: Number(totalValue.toFixed(2)),
      approvedParts: {
        count: approvedPartsCount,
        totalValue: Number(approvedPartsValue.toFixed(2)),
      },
      unapprovedParts: {
        count: unapprovedPartsCount,
        totalValue: Number(unapprovedPartsValue.toFixed(2)),
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

    // Get work order services for dropdown
    const workOrderServices = await this.workOrderServiceModel.findAll({
      attributes: ['id', 'work_order_id', 'task_status'],
      include: [
        {
          model: this.workOrderModel,
          as: 'workOrder',
          attributes: ['work_order_code'],
          required: false,
        },
      ],
      order: [['id', 'DESC']],
      limit: 100,
    });

    // Get materials for dropdown
    const materials = await this.materialModel.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
      raw: true,
    });

    // Get suppliers for dropdown
    const suppliers = await this.supplierModel.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
      raw: true,
    });

    const workOrderOptions = workOrders.map((wo) => ({
      id: wo.id,
      work_order_code: wo.work_order_code,
    }));

    const workOrderServiceOptions = workOrderServices.map((wos) => ({
      id: wos.id,
      work_order_id: wos.work_order_id,
      task_status: wos.task_status,
      work_order_code: wos.workOrder?.work_order_code || '',
    }));

    const materialOptions = materials.map((material) => ({
      id: material.id,
      material_name: material.name,
    }));

    const supplierOptions = suppliers.map((supplier) => ({
      id: supplier.id,
      supplier_name: supplier.name,
    }));

    return successResponse('Dropdown options fetched successfully', {
      workOrders: workOrderOptions,
      workOrderServices: workOrderServiceOptions,
      materials: materialOptions,
      suppliers: supplierOptions,
    });
  }

  // Private helper methods

  /**
   * Calculate total price based on quantity and unit price
   * @param quantity - Number of units
   * @param unitPrice - Price per unit
   * @returns Calculated total price with 2 decimal places
   */
  private calculateTotalPrice(quantity: number, unitPrice: number): number {
    if (!quantity || !unitPrice) {
      return 0;
    }
    return Number((quantity * unitPrice).toFixed(2));
  }

  private async validateForeignKeys(
    dto:
      | CreateWorkOrderPartDto
      | UpdateWorkOrderPartDto
      | Partial<UpdateWorkOrderPartDto>,
  ) {
    const errors: string[] = [];

    // Validate work_order_id
    if (dto.work_order_id) {
      const workOrder = await this.workOrderModel.findByPk(dto.work_order_id);
      if (!workOrder) {
        errors.push(`Work order with ID ${dto.work_order_id} does not exist`);
      }
    }

    // Validate work_order_service_id
    if (dto.work_order_service_id) {
      const workOrderService = await this.workOrderServiceModel.findByPk(
        dto.work_order_service_id,
      );
      if (!workOrderService) {
        errors.push(
          `Work order service with ID ${dto.work_order_service_id} does not exist`,
        );
      }
    }

    // Validate part_id
    if (dto.part_id) {
      const material = await this.materialModel.findByPk(dto.part_id);
      if (!material) {
        errors.push(`Material with ID ${dto.part_id} does not exist`);
      }
    }

    // Validate supplier_id
    if (dto.supplier_id) {
      const supplier = await this.supplierModel.findByPk(dto.supplier_id);
      if (!supplier) {
        errors.push(`Supplier with ID ${dto.supplier_id} does not exist`);
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

  private async validateWorkOrderServiceBelongsToWorkOrder(
    workOrderId: number,
    workOrderServiceId: number,
  ) {
    const workOrderService = await this.workOrderServiceModel.findOne({
      where: {
        id: workOrderServiceId,
        work_order_id: workOrderId,
      },
    });

    if (!workOrderService) {
      throw new BadRequestException(
        `Work order service ID ${workOrderServiceId} does not belong to work order ID ${workOrderId}`,
      );
    }
  }

  private mapUpdateFields(
    dto: UpdateWorkOrderPartDto | Partial<UpdateWorkOrderPartDto>,
    updatePayload: any,
  ) {
    // Map numeric fields (handle 0 as valid value)
    if (dto.work_order_id !== undefined) {
      updatePayload.work_order_id = dto.work_order_id ?? null;
    }
    if (dto.work_order_service_id !== undefined) {
      updatePayload.work_order_service_id = dto.work_order_service_id ?? null;
    }
    if (dto.part_id !== undefined) {
      updatePayload.part_id = dto.part_id ?? null;
    }
    if (dto.quantity !== undefined) {
      updatePayload.quantity = dto.quantity ?? null;
    }
    if (dto.unit_price !== undefined) {
      updatePayload.unit_price = dto.unit_price ?? null;
    }
    if (dto.warranty_duration !== undefined) {
      updatePayload.warranty_duration = dto.warranty_duration ?? null;
    }
    if (dto.supplier_id !== undefined) {
      updatePayload.supplier_id = dto.supplier_id ?? null;
    }
    if (dto.approved_by_userid !== undefined) {
      updatePayload.approved_by_userid = dto.approved_by_userid ?? null;
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
