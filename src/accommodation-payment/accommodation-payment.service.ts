// src/accommodation-payment/accommodation-payment.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccommodationPayment } from './entities/accommodation-payment.entity';
import { CreateAccommodationPaymentDto } from './dto/create-accommodation-payment.dto';
import { UpdateAccommodationPaymentDto } from './dto/update-accommodation-payment.dto';
import { UnifiedFileService } from 'src/common/services/unified-file.service';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { successResponse } from '@/common/utils/response';

@Injectable()
export class AccommodationPaymentService {
  constructor(
    @InjectModel(AccommodationPayment)
    private readonly paymentModel: typeof AccommodationPayment,
    private readonly unifiedFileService: UnifiedFileService,
  ) {}

  async create(
    dto: CreateAccommodationPaymentDto,
    files: Express.Multer.File[],
    userId: number,
  ) {
    const payload = {
      ...dto,
      created_by: userId,
      updated_by: null,
    };

    const record = await this.paymentModel.create(payload as any);
    const paymentId = record.id;

    let attachment: string | null = null;
    let rent_reciept: string | null = null;

    if (files && files.length > 0) {
      const filesByField = files.reduce(
        (acc, file, index) => {
          const fieldName = index === 0 ? 'attachment' : 'receipt';
          if (!acc[fieldName]) acc[fieldName] = [];
          acc[fieldName].push(file);
          return acc;
        },
        {} as { [key: string]: Express.Multer.File[] },
      );

      for (const [fieldName, fieldFiles] of Object.entries(filesByField)) {
        const results = await this.unifiedFileService.storeFiles(
          fieldFiles,
          'Accommodation',
          fieldName,
          paymentId,
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
          if (fieldName === 'attachment') {
            attachment = results[0].storedPath;
          } else if (fieldName === 'receipt') {
            rent_reciept = results[0].storedPath;
          }
        }
      }

      if (attachment || rent_reciept) {
        const updateData: any = {};
        if (attachment) updateData.attachment = attachment;
        if (rent_reciept) updateData.rent_reciept = rent_reciept;
        await record.update(updateData);
      }
    }

    return successResponse('Payment added successfully', record);
  }

  async findAll(page = 1, perPage = 10) {
    const result = await paginateQuery(this.paymentModel, {
      include: ['accommodations'],
      order: [['date', 'DESC']],
      page,
      perPage,
    });

    return successResponse('Payments fetched successfully', result);
  }

  async findOne(id: number) {
    const record = await this.paymentModel.findByPk(id, {
      include: ['accommodations'],
    });
    if (!record) throw new NotFoundException('Payment not found');
    return successResponse('Payment fetched successfully', record);
  }

  async update(
    id: number,
    dto: UpdateAccommodationPaymentDto,
    files: Express.Multer.File[],
    userId: number,
  ) {
    const record = await this.paymentModel.findByPk(id);
    if (!record) throw new NotFoundException('Payment not found');

    let attachment = record.attachment;
    let rent_reciept = record.rent_reciept;

    if (files && files.length > 0) {
      const filesByField = files.reduce(
        (acc, file, index) => {
          const fieldName = index === 0 ? 'attachment' : 'receipt';
          if (!acc[fieldName]) acc[fieldName] = [];
          acc[fieldName].push(file);
          return acc;
        },
        {} as { [key: string]: Express.Multer.File[] },
      );

      for (const [fieldName, fieldFiles] of Object.entries(filesByField)) {
        const results = await this.unifiedFileService.storeFiles(
          fieldFiles,
          'Accommodation',
          fieldName,
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
          if (fieldName === 'attachment') {
            attachment = results[0].storedPath;
          } else if (fieldName === 'receipt') {
            rent_reciept = results[0].storedPath;
          }
        }
      }
    }

    const payload = {
      ...dto,
      attachment,
      rent_reciept,
      updated_by: userId,
    };

    await record.update(payload as any);
    return successResponse('Payment updated successfully', record);
  }

  async remove(id: number) {
    const record = await this.paymentModel.findByPk(id);
    if (!record) throw new NotFoundException('Payment not found');
    await record.destroy();
    return successResponse('Payment deleted successfully');
  }
}
