import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UnitEntity } from './entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { FilterUnitDto } from './dto/filter-unit.dto';
import { Op } from 'sequelize';
import { successResponse } from 'src/common/utils/response';
import { paginateQuery } from 'src/common/utils/db-pagination';

@Injectable()
export class UnitService {
  constructor(@InjectModel(UnitEntity) private model: typeof UnitEntity) {}

  async create(dto: CreateUnitDto, userId: number) {
    const created = await this.model.create({
      ...dto,
      created_by: userId,
      created_at: new Date(),
    });
    return successResponse('Unit created successfully', created);
  }

  async update(id: number, dto: UpdateUnitDto, userId: number) {
    const unit = await this.model.findByPk(id);
    if (!unit) throw new NotFoundException('Unit not found');
    const updated = await unit.update({
      ...dto,
      updated_by: userId,
      updated_at: new Date(),
    });
    return successResponse('Unit updated successfully', updated);
  }

  async findOne(id: number) {
    const unit = await this.model.findByPk(id);
    if (!unit) throw new NotFoundException('Unit not found');
    return successResponse('Unit fetched successfully', unit);
  }

  async delete(id: number) {
    const unit = await this.model.findByPk(id);
    if (!unit) throw new NotFoundException('Unit not found');
    await unit.destroy();
    return successResponse('Unit deleted successfully');
  }

  async findAll({ searchTerm, page = 1, perPage = 15 }: FilterUnitDto) {
    const where: any = {};
    if (searchTerm) {
      where[Op.or] = [
        { unit_code: { [Op.like]: `%${searchTerm}%` } },
        { unit_name: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    const result = await paginateQuery(this.model, {
      where,
      order: [['id', 'DESC']],
      page,
      perPage,
    });

    return successResponse('Units fetched successfully', result);
  }

  async dropdown() {
    const list = await this.model.findAll({
      attributes: [
        ['unit_name', 'name'],
        ['id', 'id'],
      ],
      order: [['unit_name', 'ASC']],
    });
    return successResponse('Dropdown fetched successfully', list);
  }

  async summary() {
    const total = await this.model.count();
    return successResponse('Units summary fetched successfully', { total });
  }
}
