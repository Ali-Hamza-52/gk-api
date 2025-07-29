import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OutletEntity } from './entities/outlet.entity';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { FilterOutletDto } from './dto/filter-outlet.dto';
import { successResponse } from 'src/common/utils/response';
import { paginateQuery } from 'src/common/utils/db-pagination';

@Injectable()
export class OutletService {
  constructor(
    @InjectModel(OutletEntity)
    private readonly model: typeof OutletEntity,
  ) {}

  async create(dto: CreateOutletDto, userId: number) {
    const created = await this.model.create({
      ...(dto as any),
      created_by: userId,
    });

    return successResponse('Outlet created successfully', created);
  }

  async update(id: number, dto: UpdateOutletDto, userId: number) {
    const outlet = await this.model.findByPk(id);
    if (!outlet) throw new NotFoundException('Outlet not found');
    const updated = await outlet.update({ ...dto, updated_by: userId });
    return successResponse('Outlet updated successfully', updated);
  }

  async findAll({ page = 1, perPage = 10, searchTerm }: FilterOutletDto) {
    let where: any = {};

    if (searchTerm) {
      where = {
        ...where,
        name: { $like: `%${searchTerm}%` },
      };
    }

    const result = await paginateQuery(this.model, {
      where,
      order: [['id', 'DESC']],
      page,
      perPage,
    });

    return successResponse('Outlets fetched successfully', result);
  }

  async findOne(id: number) {
    const outlet = await this.model.findByPk(id);
    if (!outlet) throw new NotFoundException('Outlet not found');
    return successResponse('Outlet fetched successfully', outlet);
  }

  async delete(id: number) {
    const outlet = await this.model.findByPk(id);
    if (!outlet) throw new NotFoundException('Outlet not found');
    await outlet.destroy();
    return successResponse('Outlet deleted successfully');
  }

  async dropdown() {
    const list = await this.model.findAll({
      attributes: [
        ['id', 'id'],
        ['name', 'name'],
      ],
      order: [['id', 'DESC']],
    });
    return successResponse('Outlet dropdown fetched successfully', list);
  }

  async summary() {
    const total = await this.model.count();

    const cities = await this.model.findAll({
      attributes: ['city'],
      group: ['city'],
      raw: true,
    });

    return successResponse('Outlet summary fetched successfully', {
      totalOutlets: total,
      totalCities: cities.length,
    });
  }
}
