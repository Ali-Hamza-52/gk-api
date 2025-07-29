import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VendorEntity } from './vendor.entity';
import { VendorServiceEntity } from './vendor-service.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Op } from 'sequelize';
import { MulterFile } from './types/multer-file.type';
import { UnifiedFileService } from 'src/common/services/unified-file.service';
import * as fs from 'fs';
import * as path from 'path';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilterVendorDto } from './dto/filter-vendor.dto';
import { successResponse } from '@/common/utils/response';
import { PermissionService } from '@/permissions/permission.service';
import { applyOwnershipFilter } from '@/common/utils/permission-filter';
import { paginateQuery } from 'src/common/utils/db-pagination';
@Injectable()
export class VendorService {
  constructor(
    @InjectModel(VendorEntity)
    private vendorRepo: typeof VendorEntity,

    @InjectModel(VendorServiceEntity)
    private vendorServiceRepo: typeof VendorServiceEntity,
    private readonly unifiedFileService: UnifiedFileService,
    private permissionService: PermissionService,
  ) {}

  async getAll(
    filterDto: FilterVendorDto & { userId?: number; roleId?: number },
  ) {
    const {
      page = 1,
      perPage = 10,
      searchTerm,
      code,
      name,
      name_ar,
      cr_no,
      vat_no,
      contact_ops,
      contact_billing,
      contact_gov,
      userId,
      roleId,
    } = filterDto;

    let where: any = {};

    if (userId && roleId) {
      const hasViewAll = await this.permissionService.hasViewAllPermission(
        roleId,
        'vendor',
      );
      where = applyOwnershipFilter(where, {
        userId,
        roleId,
        module: 'vendor',
        hasViewAll,
      });
    }

    if (searchTerm) {
      const searchFilter = {
        [Op.or]: [
          { code: { [Op.like]: `%${searchTerm}%` } },
          { name: { [Op.like]: `%${searchTerm}%` } },
        ],
      };

      if (where[Op.and]) {
        (where[Op.and] as any[]).push(searchFilter);
      } else if (Object.keys(where).length > 0) {
        where = {
          [Op.and]: [where, searchFilter],
        };
      } else {
        where = searchFilter;
      }
    }

    if (code) {
      const codeFilter = { code: { [Op.like]: `%${code}%` } };
      if (where[Op.and]) {
        (where[Op.and] as any[]).push(codeFilter);
      } else if (Object.keys(where).length > 0) {
        where = { [Op.and]: [where, codeFilter] };
      } else {
        where = codeFilter;
      }
    }

    if (name) {
      const nameFilter = { name: { [Op.like]: `%${name}%` } };
      if (where[Op.and]) {
        (where[Op.and] as any[]).push(nameFilter);
      } else if (Object.keys(where).length > 0) {
        where = { [Op.and]: [where, nameFilter] };
      } else {
        where = nameFilter;
      }
    }

    if (name_ar) {
      const nameArFilter = { name_ar: { [Op.like]: `%${name_ar}%` } };
      if (where[Op.and]) {
        (where[Op.and] as any[]).push(nameArFilter);
      } else if (Object.keys(where).length > 0) {
        where = { [Op.and]: [where, nameArFilter] };
      } else {
        where = nameArFilter;
      }
    }

    if (cr_no) {
      const crFilter = { cr_no };
      if (where[Op.and]) {
        (where[Op.and] as any[]).push(crFilter);
      } else if (Object.keys(where).length > 0) {
        where = { [Op.and]: [where, crFilter] };
      } else {
        where = crFilter;
      }
    }

    if (vat_no) {
      const vatFilter = { vat_no };
      if (where[Op.and]) {
        (where[Op.and] as any[]).push(vatFilter);
      } else if (Object.keys(where).length > 0) {
        where = { [Op.and]: [where, vatFilter] };
      } else {
        where = vatFilter;
      }
    }

    if (contact_ops) {
      const opsFilter = { contact_ops: { [Op.like]: `%${contact_ops}%` } };
      if (where[Op.and]) {
        (where[Op.and] as any[]).push(opsFilter);
      } else if (Object.keys(where).length > 0) {
        where = { [Op.and]: [where, opsFilter] };
      } else {
        where = opsFilter;
      }
    }

    if (contact_billing) {
      const billingFilter = {
        contact_billing: { [Op.like]: `%${contact_billing}%` },
      };
      if (where[Op.and]) {
        (where[Op.and] as any[]).push(billingFilter);
      } else if (Object.keys(where).length > 0) {
        where = { [Op.and]: [where, billingFilter] };
      } else {
        where = billingFilter;
      }
    }

    if (contact_gov) {
      const govFilter = { contact_gov: { [Op.like]: `%${contact_gov}%` } };
      if (where[Op.and]) {
        (where[Op.and] as any[]).push(govFilter);
      } else if (Object.keys(where).length > 0) {
        where = { [Op.and]: [where, govFilter] };
      } else {
        where = govFilter;
      }
    }

    const result = await paginateQuery(this.vendorRepo, {
      where,
      order: [['id', 'DESC']],
      page,
      perPage,
    });

    return successResponse('Vendors fetched successfully', result);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cr_file', maxCount: 1 },
      { name: 'vat_file', maxCount: 1 },
      { name: 'contract', maxCount: 12 },
    ]),
  )
  async create(
    dto: CreateVendorDto,
    files?: Record<string, MulterFile[]>,
    userId?: number,
  ) {
    if (dto.cr_no) {
      const existsCr = await this.vendorRepo.findOne({
        where: { cr_no: dto.cr_no },
      });
      if (existsCr) throw new BadRequestException('CR Number already exists');
    }

    if (dto.vat_no) {
      const existsVat = await this.vendorRepo.findOne({
        where: { vat_no: dto.vat_no },
      });
      if (existsVat) throw new BadRequestException('VAT Number already exists');
    }

    const data: any = {
      ...dto,
      created_by: userId,
      created_at: new Date(),
    };

    const vendor = await this.vendorRepo.create(data);
    const vendorId = vendor.id;

    if (files?.cr_file?.[0]) {
      const results = await this.unifiedFileService.storeFiles(
        [files.cr_file[0]],
        'Vendors',
        'cr_file',
        vendorId,
        {
          generateThumbnails: false,
          maxFileSize: 52428800,
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
          ],
        },
      );
      if (results.length > 0) {
        await vendor.update({ cr_file: results[0].storedPath });
      }
    }
    if (files?.vat_file?.[0]) {
      const results = await this.unifiedFileService.storeFiles(
        [files.vat_file[0]],
        'Vendors',
        'vat_file',
        vendorId,
        {
          generateThumbnails: false,
          maxFileSize: 52428800,
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
          ],
        },
      );
      if (results.length > 0) {
        await vendor.update({ vat_file: results[0].storedPath });
      }
    }
    if (files?.contract?.[0]) {
      const results = await this.unifiedFileService.storeFiles(
        [files.contract[0]],
        'Vendors',
        'contract',
        vendorId,
        {
          generateThumbnails: false,
          maxFileSize: 52428800,
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
          ],
        },
      );
      if (results.length > 0) {
        await vendor.update({ contract: results[0].storedPath });
      }
    }

    let services: any[] = [];

    try {
      if (typeof dto.services === 'string') {
        services = JSON.parse(dto.services);
      } else if (Array.isArray(dto.services)) {
        services = dto.services;
      }
    } catch (err) {
      throw new BadRequestException('Invalid services format');
    }

    if (services.length) {
      const vendorServices = services.map((service) => ({
        vendor: vendor.id,
        name: service.name,
        period: service.period,
        rate: service.rate,
      }));
      await this.vendorServiceRepo.bulkCreate(vendorServices as any);
    }

    return successResponse('Vendor added successfully', vendor);
  }

  async getDetail(id: number) {
    const vendor = await this.vendorRepo.findByPk(id, {
      include: [VendorServiceEntity],
    });
    if (!vendor) throw new NotFoundException('Invalid ID');

    return successResponse('Vendor detail fetched', vendor);
  }

  async update(
    id: number,
    dto: UpdateVendorDto,
    files?: Record<string, MulterFile[]>,
    userId?: number,
  ) {
    const vendor = await this.vendorRepo.findByPk(id, {
      include: [VendorServiceEntity],
    });
    if (!vendor) throw new NotFoundException('Invalid ID');

    if (dto.cr_no && dto.cr_no !== vendor.cr_no) {
      const exists = await this.vendorRepo.findOne({
        where: { cr_no: dto.cr_no },
      });
      if (exists) throw new BadRequestException('CR Number already exists');
    }

    if (dto.vat_no && dto.vat_no !== vendor.vat_no) {
      const exists = await this.vendorRepo.findOne({
        where: { vat_no: dto.vat_no },
      });
      if (exists) throw new BadRequestException('VAT Number already exists');
    }

    if (files?.cr_file?.[0]) {
      const results = await this.unifiedFileService.storeFiles(
        [files.cr_file[0]],
        'Vendors',
        'cr_file',
        id,
        {
          generateThumbnails: false,
          maxFileSize: 52428800,
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
          ],
        },
      );
      if (results.length > 0) {
        dto.cr_file = results[0].storedPath;
      }
    }
    if (files?.vat_file?.[0]) {
      const results = await this.unifiedFileService.storeFiles(
        [files.vat_file[0]],
        'Vendors',
        'vat_file',
        id,
        {
          generateThumbnails: false,
          maxFileSize: 52428800,
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
          ],
        },
      );
      if (results.length > 0) {
        dto.vat_file = results[0].storedPath;
      }
    }
    if (files?.contract?.[0]) {
      const results = await this.unifiedFileService.storeFiles(
        [files.contract[0]],
        'Vendors',
        'contract',
        id,
        {
          generateThumbnails: false,
          maxFileSize: 52428800,
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
          ],
        },
      );
      if (results.length > 0) {
        dto.contract = results[0].storedPath;
      }
    }

    const cleanDto = Object.fromEntries(
      Object.entries(dto).map(([key, value]) => [
        key,
        value === '' ? null : value,
      ]),
    );

    const updateData = {
      ...cleanDto,
      updated_by: userId,
      updated_at: new Date(),
    };

    await this.vendorRepo.update(updateData, { where: { id } });

    await this.vendorServiceRepo.destroy({ where: { vendor: id } });

    if (dto.services?.length) {
      const services = dto.services.map((service) => ({
        vendor: id,
        name: service.name,
        period: service.period,
        rate: service.rate,
      }));
      await this.vendorServiceRepo.bulkCreate(services);
    }

    return successResponse('Vendor updated successfully', dto);
  }

  async delete(id: number) {
    const vendor = await this.vendorRepo.findByPk(id);
    if (!vendor) throw new NotFoundException('Invalid ID');

    await vendor.destroy();
    return successResponse('Vendor deleted');
  }

  private async storeFile(file: Express.Multer.File): Promise<string> {
    const uploadsDir = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'uploads',
      'vendors',
    );

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '_');
    const fileName = `${timestamp}_${safeName}`;
    const fullPath = path.join(uploadsDir, fileName);

    await fs.promises.writeFile(fullPath, file.buffer);

    return `/uploads/vendors/${fileName}`;
  }

  async getDropdownOptions() {
    const vendors = await this.vendorRepo.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });

    return successResponse('Vendors dropdown fetched', vendors);
  }

  async getSummary() {
    const totalRows = await this.vendorRepo.count();
    const inCompleteVat = await this.vendorRepo.count({
      where: { vat_no: { [Op.is]: null as any } },
    });

    return successResponse('Vendor summary fetched', {
      totalRows,
      inCompleteVat,
    });
  }
}
