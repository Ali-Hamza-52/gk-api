// src/client-pricing-rules/client-pricing-rules.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ClientPricingRule,
  PricingType,
} from './entities/client-pricing-rule.entity';
import { CreateClientPricingRuleDto } from './dto/create-client-pricing-rule.dto';
import { UpdateClientPricingRuleDto } from './dto/update-client-pricing-rule.dto';
import { FilterClientPricingRuleDto } from './dto/filter-client-pricing-rule.dto';
import { ClientEntity } from '@/sales/clients/client.entity';
import { Op } from 'sequelize';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { successResponse } from '@/common/utils/response';
import { PermissionService } from '@/permissions/permission.service';
import { applyOwnershipFilter } from '@/common/utils/permission-filter';

@Injectable()
export class ClientPricingRulesService {
  constructor(
    @InjectModel(ClientPricingRule)
    private readonly clientPricingRuleModel: typeof ClientPricingRule,
    @InjectModel(ClientEntity)
    private readonly clientModel: typeof ClientEntity,
    private permissionService: PermissionService,
  ) {}

  async create(dto: CreateClientPricingRuleDto, userId: number) {
    // Validate client exists
    const client = await this.clientModel.findByPk(dto.client_code);
    if (!client) {
      throw new BadRequestException('Client does not exist');
    }

    const payload = {
      client_code: dto.client_code,
      category: dto.category,
      pricingType: dto.pricingType,
      percentageValue: dto.percentageValue,
      appliesTo: dto.appliesTo,
      createdBy: userId,
      updatedBy: null,
      createdAt: new Date(),
      updatedAt: null,
    };

    await this.clientPricingRuleModel.create(payload as any);
    return successResponse('Client pricing rule created successfully');
  }

  async findAll(
    filterDto: FilterClientPricingRuleDto & {
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
      client_code,
      category,
      pricingType,
    } = filterDto;

    let where: any = {};

    // Apply ownership filter if needed
    if (userId && roleId) {
      const hasViewAll = await this.permissionService.hasViewAllPermission(
        roleId,
        'client_pricing_rules',
      );
      where = applyOwnershipFilter(where, {
        userId,
        roleId,
        module: 'client_pricing_rules',
        hasViewAll,
      });
    }

    // Search functionality - search by ID or client code
    if (searchTerm) {
      const searchConditions: any[] = [];

      // If searchTerm is numeric, search by ID as well
      if (!isNaN(Number(searchTerm))) {
        searchConditions.push({ id: Number(searchTerm) });
      }

      // Always search by client code in related table
      searchConditions.push({
        '$client.client_code$': { [Op.like]: `%${searchTerm}%` },
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

    if (client_code) {
      additionalFilters.client_code = client_code;
    }
    if (category) {
      additionalFilters.category = category;
    }
    if (pricingType) {
      additionalFilters.pricingType = pricingType;
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

    const result = await paginateQuery(this.clientPricingRuleModel, {
      where,
      include: [
        {
          model: this.clientModel,
          as: 'client',
          attributes: ['client_code', 'client_name'],
          required: false,
        },
      ],
      order: [['id', 'DESC']],
      page,
      perPage,
    });

    return successResponse('Client pricing rules fetched successfully', result);
  }

  async findOne(id: number) {
    const record = await this.clientPricingRuleModel.findByPk(id, {
      include: [
        {
          model: this.clientModel,
          as: 'client',
          attributes: ['client_code', 'client_name'],
        },
      ],
    });

    if (!record) {
      throw new NotFoundException('Client pricing rule not found');
    }

    return successResponse('Client pricing rule fetched successfully', record);
  }

  async update(id: number, dto: UpdateClientPricingRuleDto, userId: number) {
    const record = await this.clientPricingRuleModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Client pricing rule not found');
    }

    if (dto.client_code) {
      const client = await this.clientModel.findByPk(dto.client_code);
      if (!client) {
        throw new BadRequestException('Client does not exist');
      }
    }

    const payload = {
      ...dto,
      updatedBy: userId,
      updatedAt: new Date(),
    };

    await record.update(payload);
    return successResponse('Client pricing rule updated successfully');
  }

  async remove(id: number) {
    const record = await this.clientPricingRuleModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Client pricing rule not found');
    }

    await record.destroy();
    return successResponse('Client pricing rule deleted successfully');
  }

  async partialUpdate(
    id: number,
    dto: Partial<UpdateClientPricingRuleDto>,
    userId: number,
  ) {
    const record = await this.clientPricingRuleModel.findByPk(id);
    if (!record) {
      throw new NotFoundException('Client pricing rule not found');
    }

    // Validate client exists if client_code is being updated
    if (dto.client_code) {
      const client = await this.clientModel.findByPk(dto.client_code);
      if (!client) {
        throw new BadRequestException('Client does not exist');
      }
    }

    const payload = {
      ...dto,
      updatedBy: userId,
      updatedAt: new Date(),
    };

    await record.update(payload);
    return successResponse('Client pricing rule updated successfully');
  }

  async getSummary() {
    const totalPricingRules = await this.clientPricingRuleModel.count();

    const totalDiscounts = await this.clientPricingRuleModel.count({
      where: { pricingType: PricingType.DISCOUNT },
    });

    const totalMarkups = await this.clientPricingRuleModel.count({
      where: { pricingType: PricingType.MARKUP },
    });

    return successResponse('Summary fetched successfully', {
      totalPricingRules,
      totalDiscounts,
      totalMarkups,
    });
  }

  async getDropdownOptions() {
    const categories = await this.clientPricingRuleModel.findAll({
      attributes: ['id', 'category'],
      raw: true,
    });

    const options = categories.map((cat) => ({
      id: cat.id,
      category: cat.category,
    }));

    return successResponse('Dropdown options fetched successfully', options);
  }
}
