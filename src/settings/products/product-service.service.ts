import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductServiceEntity } from './entities/product.entity';
import { CreateProductServiceDto } from './dto/create-product-service.dto';
import { UpdateProductServiceDto } from './dto/update-product-service.dto';
import { FilterProductServiceDto } from './dto/filter-product-service.dto';
import { successResponse } from 'src/common/utils/response';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { Op } from 'sequelize';
import { transformProductService } from './transformers/transformProductService';
import { ProductCategoryEntity } from './categories/entities/product-category.entity';
import { UnitEntity } from '../units/entities/unit.entity';
import { OutletEntity } from '../outlets/entities/outlet.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductServiceEntity)
    private model: typeof ProductServiceEntity,
  ) {}

  async create(dto: CreateProductServiceDto, userId: number) {
    (dto as any).created_by = userId;
    const created = await this.model.create(dto as any);
    return successResponse('Product created successfully', created);
  }

  async update(id: number, dto: UpdateProductServiceDto, userId: number) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Product not found');
    (dto as any).updated_by = userId;
    (dto as any).updated_at = new Date();
    const updated = await item.update({ ...dto });
    return successResponse('Product updated successfully', updated);
  }

  async findOne(id: number) {
    const item = await this.model.findByPk(id, {
      include: [
        { model: ProductCategoryEntity },
        { model: UnitEntity, as: 'purchase_unit' },
        { model: UnitEntity, as: 'consumption_unit' },
        { model: OutletEntity, as: 'outlet' },
      ],
    });

    if (!item) throw new NotFoundException('Product not found');

    return successResponse(
      'Product fetched successfully',
      transformProductService(item),
    );
  }

  async delete(id: number) {
    const item = await this.model.findByPk(id);
    if (!item) throw new NotFoundException('Product not found');
    await item.destroy();
    return successResponse('Product deleted successfully');
  }

  async findAll({
    page = 1,
    perPage = 15,
    searchTerm,
  }: FilterProductServiceDto) {
    const where: any = {};
    if (searchTerm) {
      where.name = { [Op.like]: `%${searchTerm}%` };
    }

    const result = await paginateQuery(this.model, {
      where,
      order: [['id', 'DESC']],
      include: [
        { model: ProductCategoryEntity, as: 'category' },
        { model: UnitEntity, as: 'purchase_unit' },
        { model: UnitEntity, as: 'consumption_unit' },
        { model: OutletEntity, as: 'outlet' },
      ],
      page,
      perPage,
    });

    return successResponse('Products fetched successfully', result);
  }

  async dropdown() {
    const list = await this.model.findAll({
      attributes: [
        ['name', 'name'],
        ['id', 'id'],
      ],
      order: [['name', 'ASC']],
    });
    return successResponse('Dropdown fetched successfully', list);
  }

  async summary() {
    const total = await this.model.count();
    return successResponse('Summary fetched successfully', { total });
  }
}
