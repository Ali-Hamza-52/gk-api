import { successResponse } from 'src/common/utils/response';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SkillEntity } from './entities/skills.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Op } from 'sequelize';
import { paginateQuery } from 'src/common/utils/db-pagination';

@Injectable()
export class SkillsService {
  constructor(@InjectModel(SkillEntity) private model: typeof SkillEntity) {}

  async create(dto: CreateSkillDto, userId: number) {
    const skill = await this.model.create({
      ...dto,
      created_by: userId,
      created_at: new Date(),
    });
    return successResponse('Skill created successfully', skill);
  }

  async update(id: number, dto: UpdateSkillDto, userId: number) {
    const skill = await this.model.findByPk(id);
    if (!skill) throw new NotFoundException('Skill not found');

    const updated = await skill.update({
      ...dto,
      updated_by: userId,
      updated_at: new Date(),
    });
    return successResponse('Skill updated successfully', updated);
  }

  async findOne(id: number) {
    const skill = await this.model.findByPk(id);
    if (!skill) throw new NotFoundException('Skill not found');
    return successResponse('Skill fetched successfully', skill);
  }

  async delete(id: number, userId: number) {
    const skill = await this.model.findByPk(id);
    if (!skill) throw new NotFoundException('Skill not found');

    await skill.destroy();
    return successResponse('Skill deleted successfully');
  }

  async findAll({
    page = 1,
    perPage = 10,
    searchTerm,
  }: {
    page?: number;
    perPage?: number;
    searchTerm?: string;
  }) {
    const where: any = {};
    if (searchTerm) {
      where.name_en = { [Op.like]: `%${searchTerm}%` };
    }

    const result = await paginateQuery(this.model, {
      where,
      order: [['name_en', 'ASC']],
      page,
      perPage,
    });

    return successResponse('Skills fetched successfully', result);
  }

  async getDropdown() {
    const data = await this.model.findAll({
      attributes: [
        ['name_en', 'name_en'],
        ['name_ar', 'name_ar'],
      ],
    });
    return successResponse('Skills dropdown fetched', data);
  }

  async getSummary() {
    const totalRows = await this.model.count();
    return successResponse('Skills summary fetched', {
      totalRows,
    });
  }
}
