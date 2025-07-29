import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AssetCapacityEntity } from './entities/asset-capacity.entity';
import { CreateAssetCapacityDto } from './dto/create-asset-capacity.dto';
import { UpdateAssetCapacityDto } from './dto/update-asset-capacity.dto';
import { FilterAssetCapacityDto } from './dto/filter-asset-capacity.dto';
import { Op } from 'sequelize';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { successResponse } from 'src/common/utils/response';

@Injectable()
export class AssetCapacityService {
  constructor(
    @InjectModel(AssetCapacityEntity) private model: typeof AssetCapacityEntity,
  ) {}

  async create(dto: CreateAssetCapacityDto, userId: number) {
    const created = await this.model.create({
      ...dto,
      created_by: userId,
      created_at: new Date(),
    });
    return successResponse('Asset Capacity created successfully', created);
  }

  async update(id: number, dto: UpdateAssetCapacityDto, userId: number) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Asset Capacity not found');
    const updated = await item.update({
      ...dto,
      updated_by: userId,
      updated_at: new Date(),
    });
    return successResponse('Asset Capacity updated successfully', updated);
  }

  async findOne(id: number) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Asset Capacity not found');
    return successResponse('Asset Capacity fetched successfully', item);
  }

  async delete(id: number) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Asset Capacity not found');
    await item.destroy();
    return successResponse('Asset Capacity deleted successfully');
  }

  async findAll({
    page = 1,
    perPage = 15,
    searchTerm,
  }: FilterAssetCapacityDto) {
    const where: any = {};
    if (searchTerm) {
      where.title = { [Op.like]: `%${searchTerm}%` };
    }

    const result = await paginateQuery(this.model, {
      where,
      order: [['id', 'DESC']],
      page,
      perPage,
    });

    return successResponse('Asset Capacities fetched successfully', result);
  }

  async dropdown() {
    const list = await this.model.findAll({
      attributes: [
        ['title', 'name'],
        ['id', 'id'],
      ],
      order: [['title', 'ASC']],
    });
    return successResponse('Dropdown fetched successfully', list);
  }
}
