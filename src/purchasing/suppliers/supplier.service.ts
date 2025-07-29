// src/purchasing/suppliers/supplier.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SupplierEntity } from './entities/supplier.entity';
import { SupplierItemEntity } from './entities/supplier-item.entity';
import { SupplierTypeEntity } from './entities/supplier-type.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Op } from 'sequelize';
import { SupplierFilterDto } from './entities/filter-supplier.dto';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { successResponse } from '@/common/utils/response';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(SupplierEntity) private supplierModel: typeof SupplierEntity,
    @InjectModel(SupplierItemEntity)
    private itemModel: typeof SupplierItemEntity,
    @InjectModel(SupplierTypeEntity)
    private typeModel: typeof SupplierTypeEntity,
  ) {}

  async create(data: CreateSupplierDto, userId: number) {
    const exists = await this.supplierModel.findOne({
      where: { vat_number: data.vat_number },
    });
    if (exists) throw new BadRequestException('VAT Number already exists');

    const supplier = await this.supplierModel.create({
      ...data,
      created_by: userId,
    });

    if (data.supplier_types?.length) {
      await Promise.all(
        data.supplier_types.map((typeId) =>
          this.itemModel.create({
            supplierId: supplier.id,
            typeId,
            created_by: userId,
            created_at: new Date(),
          }),
        ),
      );
    }

    return successResponse(
      'Supplier created successfully',
      await this.findOne(supplier.id),
    );
  }

  async update(id: number, data: UpdateSupplierDto, userId: number) {
    const supplier = await this.supplierModel.findByPk(id);
    if (!supplier) throw new NotFoundException('Supplier not found');

    if (data.vat_number && data.vat_number !== supplier.vat_number) {
      const exists = await this.supplierModel.findOne({
        where: { vat_number: data.vat_number },
      });
      if (exists) throw new BadRequestException('VAT Number already exists');
    }

    await supplier.update({
      ...data,
      updated_by: userId,
      updated_at: new Date(),
    });

    await this.itemModel.destroy({ where: { supplierId: id } });

    if (data.supplier_types?.length) {
      await Promise.all(
        data.supplier_types.map((typeId) =>
          this.itemModel.create({
            supplierId: id,
            typeId,
            created_by: userId,
            created_at: new Date(),
          }),
        ),
      );
    }

    return successResponse(
      'Supplier updated successfully',
      await this.findOne(id),
    );
  }

  async findAll(filterDto: SupplierFilterDto) {
    const {
      page = 1,
      perPage = 10,
      searchTerm,
      name,
      name_ar,
      vat_number,
      cr_number,
      contact_name,
      contact_number,
      city,
      bank_name,
      account_name,
      iban,
    } = filterDto;

    const where: any = {};

    if (searchTerm) {
      where[Op.or] = [
        { name: { [Op.like]: `%${searchTerm}%` } },
        { name_ar: { [Op.like]: `%${searchTerm}%` } },
        { vat_number: { [Op.like]: `%${searchTerm}%` } },
        { cr_number: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (name_ar) where.name_ar = { [Op.like]: `%${name_ar}%` };
    if (vat_number) where.vat_number = { [Op.like]: `%${vat_number}%` };
    if (cr_number) where.cr_number = { [Op.like]: `%${cr_number}%` };
    if (contact_name) where.contact_name = { [Op.like]: `%${contact_name}%` };
    if (contact_number)
      where.contact_number = { [Op.like]: `%${contact_number}%` };
    if (city) where.city = { [Op.like]: `%${city}%` };
    if (bank_name) where.bank_name = { [Op.like]: `%${bank_name}%` };
    if (account_name) where.account_name = { [Op.like]: `%${account_name}%` };
    if (iban) where.iban = { [Op.like]: `%${iban}%` };

    const result = await paginateQuery(this.supplierModel, {
      where,
      include: [{ model: this.itemModel, include: [this.typeModel] }],
      order: [['id', 'ASC']],
      page,
      perPage,
    });

    return successResponse('Suppliers fetched successfully', result);
  }

  async findOne(id: number) {
    const data = await this.supplierModel.findOne({
      where: { id },
      include: [{ model: SupplierItemEntity, include: [SupplierTypeEntity] }],
    });
    if (!data) throw new NotFoundException('Supplier not found');
    return successResponse('Supplier fetched successfully', data);
  }

  async delete(id: number, userId: number) {
    const supplier = await this.supplierModel.findByPk(id);
    if (!supplier) throw new NotFoundException();

    await this.itemModel.destroy({ where: { supplierId: id } });
    await supplier.destroy();

    return successResponse('Supplier deleted successfully');
  }

  async createType(type: string, userId: number) {
    const typeModel = await this.typeModel.create({
      type,
      created_by: userId,
      created_at: new Date(),
    });
    return successResponse('Supplier type created', typeModel);
  }

  async findAllTypes(search = '') {
    const where = search ? { type: { [Op.like]: `%${search}%` } } : {};
    const types = await this.typeModel.findAll({ where });
    return successResponse('Supplier types fetched', types);
  }

  async updateType(id: number, type: string, userId: number) {
    const typeModel = await this.typeModel.findByPk(id);
    if (!typeModel) throw new NotFoundException('Supplier Type not found');

    typeModel.type = type;
    typeModel.updated_by = userId;
    typeModel.updated_at = new Date();
    await typeModel.save();

    return successResponse('Supplier type updated', typeModel);
  }

  async deleteType(id: number, userId: number) {
    const typeModel = await this.typeModel.findByPk(id);
    if (!typeModel) throw new NotFoundException('Supplier Type not found');

    await typeModel.destroy();
    return successResponse('Supplier type deleted');
  }

  async getSupplierSummary() {
    const totalRows = await this.supplierModel.count();
    const inCompleteVat = await this.supplierModel.count({
      where: { vat_number: null },
    });

    return successResponse('Supplier summary fetched', {
      totalRows,
      inCompleteVat,
    });
  }

  async getDropdown() {
    const data = await this.supplierModel.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });

    return successResponse('Supplier dropdown fetched', data);
  }
}
