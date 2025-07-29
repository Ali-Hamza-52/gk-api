import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WarehouseEntity } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { FilterWarehouseDto } from './dto/filter-warehouse.dto';
import { successResponse } from 'src/common/utils/response';
import { paginateQuery } from 'src/common/utils/db-pagination';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectModel(WarehouseEntity)
    private readonly model: typeof WarehouseEntity,
  ) {}

  async create(dto: CreateWarehouseDto, userId: number) {
    const created = await this.model.create({
      ...(dto as any),
      created_by: userId,
    });

    return successResponse('Warehouse created successfully', created);
  }

  async update(id: number, dto: UpdateWarehouseDto, userId: number) {
    const warehouse = await this.model.findByPk(id);
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    const updated = await warehouse.update({
      ...dto,
      updated_by: userId,
      updated_at: new Date(),
    });
    return successResponse('Warehouse updated successfully', updated);
  }

  async findAll({ page = 1, perPage = 10, searchTerm }: FilterWarehouseDto) {
    const where: any = {};
    if (searchTerm) {
      where.name = { $like: `%${searchTerm}%` };
    }

    const result = await paginateQuery(this.model, {
      where,
      order: [['id', 'DESC']],
      page,
      perPage,
    });

    return successResponse('Warehouses fetched successfully', result);
  }

  async findOne(id: number) {
    const warehouse = await this.model.findByPk(id);
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return successResponse('Warehouse fetched successfully', warehouse);
  }

  async delete(id: number) {
    const warehouse = await this.model.findByPk(id);
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    await warehouse.destroy();
    return successResponse('Warehouse deleted successfully');
  }

  async dropdown() {
    const list = await this.model.findAll({
      attributes: [
        ['id', 'id'],
        ['name', 'name'],
      ],
      order: [['id', 'DESC']],
    });
    return successResponse('Warehouse dropdown fetched successfully', list);
  }

  async summary() {
    const total = await this.model.count();

    const cities = await this.model.findAll({
      attributes: ['city'],
      group: ['city'],
      raw: true,
    });

    return successResponse('Warehouse summary fetched successfully', {
      totalWarehouses: total,
      totalCities: cities.length,
    });
  }
}
