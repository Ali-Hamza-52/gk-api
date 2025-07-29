import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MaterialCategoryEntity } from './entities/material-category.entity';
import { CreateMaterialCategoryDto } from './dto/create-material-category.dto';
import { UpdateMaterialCategoryDto } from './dto/update-material-category.dto';
import { FilterMaterialCategoryDto } from './dto/filter-material-category.dto';
import { successResponse } from 'src/common/utils/response';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { Op } from 'sequelize';

@Injectable()
export class MaterialCategoryService {
  constructor(
    @InjectModel(MaterialCategoryEntity)
    private readonly model: typeof MaterialCategoryEntity,
  ) {}

  async create(dto: CreateMaterialCategoryDto, userId: number) {
    (dto as any).created_by = userId;
    const created = await this.model.create(dto as any);
    return successResponse('Category created successfully', created);
  }

  async update(id: number, dto: UpdateMaterialCategoryDto, userId: number) {
    const category = await this.model.findByPk(id);
    if (!category) throw new NotFoundException('Category not found');
    await category.update({
      ...dto,
      updated_by: userId,
      updated_at: new Date(),
    });
    return successResponse('Category updated successfully', category);
  }

  async delete(id: number) {
    const category = await this.model.findByPk(id);
    if (!category) throw new NotFoundException('Category not found');
    await category.destroy();
    return successResponse('Category deleted successfully');
  }

  async findOne(id: number) {
    const category = await this.model.findByPk(id);
    if (!category) throw new NotFoundException('Category not found');
    return successResponse('Category fetched successfully', category);
  }

  async findAll({
    page = 1,
    perPage = 10,
    searchTerm,
  }: FilterMaterialCategoryDto) {
    const where: any = {};
    if (searchTerm) {
      where.category_name = { [Op.like]: `%${searchTerm}%` };
    }

    const result = await paginateQuery(this.model, {
      where,
      order: [['id', 'DESC']],
      page,
      perPage,
    });

    return successResponse('Categories fetched successfully', result);
  }

  async dropdown() {
    const list = await this.model.findAll({
      attributes: [
        ['category_name', 'name'],
        ['id', 'id'],
      ],
      order: [['category_name', 'ASC']],
    });
    return successResponse('Dropdown fetched successfully', list);
  }
}
