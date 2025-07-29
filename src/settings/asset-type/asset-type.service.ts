import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AssetTypeEntity } from './entities/asset-type.entity';
import { CreateAssetTypeDto } from './dto/create-asset-type.dto';
import { UpdateAssetTypeDto } from './dto/update-asset-type.dto';
import { FilterAssetTypeDto } from './dto/filter-asset-type.dto';
import { Op } from 'sequelize';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { successResponse } from 'src/common/utils/response';

@Injectable()
export class AssetTypeService {
  constructor(
    @InjectModel(AssetTypeEntity)
    private model: typeof AssetTypeEntity,
  ) {}

  async create(dto: CreateAssetTypeDto, userId: number) {
    const created = await this.model.create({
      ...dto,
      created_by: userId,
      created_at: new Date(),
    });
    return successResponse('Asset Type created successfully', created);
  }

  async update(id: number, dto: UpdateAssetTypeDto, userId: number) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Asset Type not found');
    const updated = await item.update({
      ...dto,
      updated_by: userId,
      updated_at: new Date(),
    });
    return successResponse('Asset Type updated successfully', updated);
  }

  async findOne(id: number) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Asset Type not found');
    return successResponse('Asset Type fetched successfully', item);
  }

  async delete(id: number) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Asset Type not found');
    await item.destroy();
    return successResponse('Asset Type deleted successfully');
  }

  async findAll({ page = 1, perPage = 15, searchTerm }: FilterAssetTypeDto) {
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

    return successResponse('Asset Types fetched successfully', result);
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
