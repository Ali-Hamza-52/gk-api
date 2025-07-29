import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { FmServiceSettings } from './fm-service-settings.entity';
import { CreateFmServiceSettingsDto } from './dto/create-fm-service-settings.dto';
import { UpdateFmServiceSettingsDto } from './dto/update-fm-service-settings.dto';
import { FilterFmServiceSettingsDto } from './dto/filter-fm-service-settings.dto';

@Injectable()
export class FmServiceSettingsService {
  constructor(
    @InjectModel(FmServiceSettings)
    private readonly model: typeof FmServiceSettings,
  ) {}

  async create(dto: CreateFmServiceSettingsDto, userId: number) {
    return this.model.create({
      ...dto,
      created_by: userId,
      updated_by: userId,
    } as any);
  }

  async findAll(filter: FilterFmServiceSettingsDto) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      is_active,
      building_type,
    } = filter;
    const offset = (page - 1) * limit;

    const whereClause: Record<string, any> = {};

    if (search) {
      whereClause.task_name = {
        [Op.like]: `%${search}%`,
      };
    }

    if (category) {
      whereClause.category = category;
    }

    if (is_active !== undefined) {
      whereClause.is_active = is_active;
    }

    if (building_type) {
      whereClause.building_type = {
        [Op.like]: `%${building_type}%`,
      };
    }

    const { rows: data, count: total } = await this.model.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    return this.model.findByPk(id);
  }

  async update(id: number, dto: UpdateFmServiceSettingsDto, userId: number) {
    await this.model.update({ ...dto, updated_by: userId }, { where: { id } });
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.model.destroy({ where: { id } });
  }

  async dropdown() {
    return this.model.findAll({
      attributes: ['id', 'task_name', 'category'],
      where: { is_active: true },
      order: [['task_name', 'ASC']],
    });
  }
}
