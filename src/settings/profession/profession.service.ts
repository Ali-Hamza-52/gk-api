import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProfessionEntity } from './entities/profession.entity';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { FilterProfessionDto } from './dto/filter-profession.dto';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { Op } from 'sequelize';
import { successResponse } from 'src/common/utils/response';

@Injectable()
export class ProfessionService {
  constructor(
    @InjectModel(ProfessionEntity) private model: typeof ProfessionEntity,
  ) {}

  async create(dto: CreateProfessionDto, userId?: number) {
    const created = await this.model.create({
      ...dto,
      created_by: userId,
      created_at: new Date(),
    } as any);
    return successResponse('Profession created successfully', created);
  }

  async update(
    profession_en: string,
    dto: UpdateProfessionDto,
    userId?: number,
  ) {
    const item = await this.model.findOne({ where: { profession_en } });
    if (!item) throw new NotFoundException('Profession not found');
    const updated = await item.update({
      ...dto,
      updated_by: userId,
      updated_at: new Date(),
    });
    return successResponse('Profession updated successfully', updated);
  }

  async findOne(profession_en: string) {
    const item = await this.model.findOne({ where: { profession_en } });
    if (!item) throw new NotFoundException('Profession not found');
    return successResponse('Profession fetched successfully', item);
  }

  async delete(profession_en: string) {
    const item = await this.model.findOne({ where: { profession_en } });
    if (!item) throw new NotFoundException('Profession not found');
    await item.destroy();
    return successResponse('Profession deleted successfully');
  }

  async findAll({ page = 1, perPage = 15, searchTerm }: FilterProfessionDto) {
    const where: any = {};
    if (searchTerm) {
      where.profession_en = { [Op.like]: `%${searchTerm}%` };
    }

    const result = await paginateQuery(this.model, {
      where,
      order: [['profession_en', 'ASC']],
      page,
      perPage,
    });

    return successResponse('Professions fetched successfully', result);
  }

  async dropdown() {
    const list = await this.model.findAll({
      attributes: [
        ['profession_en', 'name'],
        ['profession_en', 'id'],
      ],
      order: [['profession_en', 'ASC']],
    });
    return successResponse('Dropdown fetched successfully', list);
  }
}
