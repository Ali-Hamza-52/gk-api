import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AssetMakeEntity } from './entities/asset-make.entity';
import { CreateAssetMakeDto } from './dto/create-asset-make.dto';
import { UpdateAssetMakeDto } from './dto/update-asset-make.dto';
import { FilterAssetMakeDto } from './dto/filter-asset-make.dto';
import { Op } from 'sequelize';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { successResponse } from 'src/common/utils/response';

@Injectable()
export class AssetMakeService {
  constructor(
    @InjectModel(AssetMakeEntity) private model: typeof AssetMakeEntity,
  ) {}

  async create(dto: CreateAssetMakeDto, userId: number) {
    const created = await this.model.create({
      ...dto,
      created_by: userId,
      created_at: new Date(),
    });
    return successResponse('Asset Make created successfully', created);
  }

  async update(id: number, dto: UpdateAssetMakeDto, userId: number) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Asset Make not found');
    const updated = await item.update({
      ...dto,
      updated_by: userId,
      updated_at: new Date(),
    });
    return successResponse('Asset Make updated successfully', updated);
  }

  async findOne(id: number) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Asset Make not found');
    return successResponse('Asset Make fetched successfully', item);
  }

  async delete(id: number) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Asset Make not found');
    await item.destroy();
    return successResponse('Asset Make deleted successfully');
  }

  async findAll({ page = 1, perPage = 15, searchTerm }: FilterAssetMakeDto) {
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

    return successResponse('Asset Makes fetched successfully', result);
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
