// src/products/categories/product-categories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductCategoryEntity } from './entities/product-category.entity';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { FilterProductCategoryDto } from './dto/filter-product-category.dto';
import { successResponse } from 'src/common/utils/response';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { storeMultipleFiles } from 'src/common/utils/file-upload';
import { Op } from 'sequelize';
@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectModel(ProductCategoryEntity)
    private readonly repo: typeof ProductCategoryEntity,
  ) {}

  async create(
    dto: CreateProductCategoryDto,
    file?: Express.Multer.File,
    userId?: number,
  ) {
    if (file) {
      const [path] = await storeMultipleFiles(
        [file],
        'categories/icon',
        Date.now(),
      );
      (dto as any).icon = path;
    }
    (dto as any).created_by = userId;
    const cat = await this.repo.create(dto as any);
    return successResponse('Category created', cat);
  }

  async findAll(filter: FilterProductCategoryDto) {
    const { page = 1, perPage = 10, searchTerm } = filter;
    const where: any = {};
    if (searchTerm) {
      where.title = { [Op.like]: `%${searchTerm}%` };
    }
    const result = await paginateQuery(this.repo, {
      where,
      order: [['id', 'DESC']],
      page,
      perPage,
    });
    return successResponse('Categories fetched', result);
  }

  async findOne(id: number) {
    const item = await this.repo.findByPk(id);
    if (!item) throw new NotFoundException('Category not found');
    return successResponse('Category fetched', item);
  }

  async update(
    id: number,
    dto: UpdateProductCategoryDto,
    file?: Express.Multer.File,
    userId?: number,
  ) {
    const item = await this.repo.findByPk(id);
    if (!item) throw new NotFoundException('Category not found');
    if (file) {
      const [path] = await storeMultipleFiles([file], 'categories/icon', id);
      (dto as any).icon = path;
    }
    (dto as any).updated_by = userId;
    (dto as any).updated_at = new Date();
    const updated = await item.update(dto as any);
    return successResponse('Category updated', updated);
  }

  async remove(id: number) {
    const item = await this.repo.findByPk(id);
    if (!item) throw new NotFoundException('Category not found');
    await item.destroy();
    return successResponse('Category deleted');
  }

  async dropdown() {
    const list = await this.repo.findAll({
      attributes: [
        ['title', 'name'],
        ['id', 'id'],
      ],
      order: [['title', 'ASC']],
    });
    return successResponse('Dropdown fetched', list);
  }
}
