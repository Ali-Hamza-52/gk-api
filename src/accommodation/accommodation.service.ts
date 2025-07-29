// src/accommodation/accommodation.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Accommodation } from './entities/accommodation.entity';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';
import { Op } from 'sequelize';
import { UnifiedFileService } from 'src/common/services/unified-file.service';
import { paginateQuery } from 'src/common/utils/db-pagination';
import * as dayjs from 'dayjs';
import { successResponse } from '@/common/utils/response';
import { PermissionService } from '@/permissions/permission.service';
import { applyOwnershipFilter } from '@/common/utils/permission-filter';
import { FilterAccommodationDto } from './dto/filter-accommodation.dto';
@Injectable()
export class AccommodationService {
  constructor(
    @InjectModel(Accommodation)
    private readonly model: typeof Accommodation,
    private readonly unifiedFileService: UnifiedFileService,
    private permissionService: PermissionService,
  ) {}

  async create(
    dto: CreateAccommodationDto,
    files: Express.Multer.File[],
    userId: number,
  ) {
    const payload: any = {
      ...dto,
      created_by: userId,
      updated_by: null,
      accommodation_status: 'Open',
      dueDate: dto.dueDate || null,
    };

    if (Array.isArray(dto.services)) {
      payload.services = dto.services.join(',');
    }

    const accommodation = await this.model.create(payload);
    const accommodationId = accommodation.id;

    let contractAttachments: string[] = [];
    if (files && files.length > 0) {
      const results = await this.unifiedFileService.storeFiles(
        files,
        'Accommodation',
        'contract_attachment',
        accommodationId,
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
      contractAttachments = results.map((r) => r.storedPath);

      if (contractAttachments.length > 0) {
        await accommodation.update({
          contract_attachment: contractAttachments,
        });
      }
    }

    return successResponse('Accommodation added successfully');
  }

  async findAll(
    filterDto: FilterAccommodationDto & { userId?: number; roleId?: number },
  ) {
    const {
      page = 1,
      perPage = 10,
      searchTerm,
      userId,
      roleId,
      ...filters
    } = filterDto;

    let where: any = {};

    if (userId && roleId) {
      const hasViewAll = await this.permissionService.hasViewAllPermission(
        roleId,
        'accommodation',
      );
      where = applyOwnershipFilter(where, {
        userId,
        roleId,
        module: 'accommodation',
        hasViewAll,
      });
    }

    if (searchTerm) {
      const searchFilter = { name: { [Op.like]: `%${searchTerm}%` } };

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

    // Add remaining filters
    for (const key in filters) {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        let filterCondition: any;
        if (Array.isArray(value)) {
          filterCondition = { [key]: { [Op.contains]: value } };
        } else {
          filterCondition = { [key]: { [Op.like]: `%${value}%` } };
        }

        if (where[Op.and]) {
          (where[Op.and] as any[]).push(filterCondition);
        } else if (Object.keys(where).length > 0) {
          where = {
            [Op.and]: [where, filterCondition],
          };
        } else {
          where = filterCondition;
        }
      }
    }

    const result = await paginateQuery(this.model, {
      where,
      order: [['dueDate', 'ASC']],
      page,
      perPage,
    });
    return successResponse('Accommodations fetched successfully', result);
  }

  async findOne(id: number) {
    const record = await this.model.findByPk(id);
    if (!record) throw new NotFoundException('Accommodation not found');
    return successResponse('Accommodation fetched successfully', record);
  }

  async update(
    id: number,
    dto: UpdateAccommodationDto,
    files: Express.Multer.File[],
    userId: number,
  ) {
    const record = await this.model.findByPk(id);
    if (!record) throw new NotFoundException('Accommodation not found');

    let attachments: string[] = [];
    if (Array.isArray(record.contract_attachment)) {
      attachments = [...record.contract_attachment];
    }

    let newFiles: string[] = [];
    if (files && files.length > 0) {
      const results = await this.unifiedFileService.storeFiles(
        files,
        'Accommodation',
        'contract_attachment',
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
      newFiles = results.map((r) => r.storedPath);
    }
    const allAttachments = [...attachments, ...newFiles];

    const payload: any = {
      ...dto,
      contract_attachment: allAttachments,
      updated_by: userId,
      updated_at: new Date(),
    };

    if (Array.isArray(dto.services)) {
      payload.services = dto.services.join(',');
    }

    if (dto.dueDate) {
      payload.dueDate = dto.dueDate;
    }

    await record.update(payload);

    return successResponse('Accommodation updated successfully');
  }

  async remove(id: number) {
    const record = await this.model.findByPk(id);
    if (!record) throw new NotFoundException('Accommodation not found');
    await record.destroy();
    return successResponse('Accommodation deleted successfully');
  }

  async getDropdownOptions() {
    const records = await this.model.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
      raw: true,
    });

    return successResponse('Accommodation options fetched', records);
  }

  async getAccommodationSummary() {
    const now = dayjs();
    const sevenDaysLater = now.add(7, 'day').format('YYYY-MM-DD');
    const today = now.format('YYYY-MM-DD');

    const totalOpen = await this.model.count({
      where: { accommodation_status: 'Open' },
    });

    const totalRealEstate = await this.model.count();

    const upcomingCount = await this.model.count({
      where: {
        dueDate: {
          [Op.gt]: today,
          [Op.lte]: sevenDaysLater,
        },
        accommodation_status: 'Open',
      },
    });

    const pastCount = await this.model.count({
      where: {
        dueDate: {
          [Op.lt]: today,
        },
        accommodation_status: 'Open',
      },
    });

    return successResponse('Accommodation summary fetched successfully.', {
      totalOpen,
      upcomingCount,
      totalRealEstate,
      pastCount,
    });
  }
}
