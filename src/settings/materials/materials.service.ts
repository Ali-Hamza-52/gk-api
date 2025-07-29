import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MaterialEntity } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { FilterMaterialDto } from './dto/filter-material.dto';
import { successResponse } from 'src/common/utils/response';
import { Op } from 'sequelize';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { transformMaterial } from './transformers/material.transformer';
import { UnitEntity } from '../units/entities/unit.entity';
import { MaterialCategoryEntity } from '../material-categories/entities/material-category.entity';

@Injectable()
export class MaterialService {
  constructor(
    @InjectModel(MaterialEntity) private model: typeof MaterialEntity,
  ) {}

  async create(dto: CreateMaterialDto, userId: number) {
    (dto as any).created_by = userId;
    const created = await this.model.create(dto as any);
    return successResponse('Material created successfully', created);
  }

  async update(id: number, dto: UpdateMaterialDto, userId: number) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Material not found');
    await item.update({ ...dto, updated_by: userId, updated_at: new Date() });
    return successResponse('Material updated successfully', item);
  }

  async findOne(id: number) {
    const item = await this.model.findByPk(id, {
      include: [
        { model: MaterialCategoryEntity, as: 'category' },
        { model: UnitEntity, as: 'purchase_unit' },
        { model: UnitEntity, as: 'consumption_unit' },
      ],
    });

    if (!item) throw new NotFoundException('Material not found');
    return successResponse(
      'Material fetched successfully',
      transformMaterial(item),
    );
  }

  async delete(id: number) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Material not found');
    await item.destroy();
    return successResponse('Material deleted successfully');
  }

  async findAll({ page = 1, perPage = 15, searchTerm }: FilterMaterialDto) {
    const where: any = {};
    if (searchTerm) {
      where.name = { [Op.like]: `%${searchTerm}%` };
    }

    const result = await paginateQuery(this.model, {
      where,
      order: [['id', 'DESC']],
      include: [
        { model: MaterialCategoryEntity, as: 'category' },
        { model: UnitEntity, as: 'purchase_unit' },
        { model: UnitEntity, as: 'consumption_unit' },
      ],
      page,
      perPage,
    });

    return successResponse('Materials fetched successfully', result);
  }

  async dropdown() {
    const list = await this.model.findAll({
      attributes: [
        ['name', 'name'],
        ['id', 'id'],
      ],
      order: [['name', 'ASC']],
    });
    return successResponse('Dropdown fetched successfully', list);
  }

  async summary() {
    const total = await this.model.count();
    return successResponse('Summary fetched successfully', { total });
  }
}
