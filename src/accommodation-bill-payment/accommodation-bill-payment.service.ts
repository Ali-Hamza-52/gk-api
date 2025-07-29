// src/accommodation-bill-payment/accommodation-bill-payment.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccommodationBillPayment } from './entities/accommodation-bill-payment.entity';
import { CreateAccommodationBillPaymentDto } from './dto/create-accommodation-bill-payment.dto';
import { UpdateAccommodationBillPaymentDto } from './dto/update-accommodation-bill-payment.dto';
import { UnifiedFileService } from 'src/common/services/unified-file.service';
import { paginateQuery } from 'src/common/utils/db-pagination';

@Injectable()
export class AccommodationBillPaymentService {
  constructor(
    @InjectModel(AccommodationBillPayment)
    private readonly model: typeof AccommodationBillPayment,
    private readonly unifiedFileService: UnifiedFileService,
  ) {}

  async create(
    dto: CreateAccommodationBillPaymentDto,
    files: Express.Multer.File[] = [],
    userId: number,
  ) {
    const billPayment = await this.model.create({
      ...dto,
      created_by: userId,
      updated_by: null,
    });
    const billPaymentId = billPayment.id;

    let attachment: string | undefined;
    if (files.length > 0) {
      const results = await this.unifiedFileService.storeFiles(
        [files[0]],
        'Accommodation',
        'attachment',
        billPaymentId,
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
        attachment = results[0].storedPath;
        await billPayment.update({ attachment });
      }
    }

    return {
      message: 'Accommodation bill payment created successfully',
      success: true,
    };
  }

  async findAll(page = 1, perPage = 10, accommodation_base_id?: number) {
    const whereClause = accommodation_base_id ? { accommodation_base_id } : {};

    const result = await paginateQuery(this.model, {
      where: whereClause,
      include: ['accommodation'],
      order: [['date', 'DESC']],
      page,
      perPage,
    });

    return {
      success: true,
      message: 'Accommodation bill payments fetched successfully.',
      data: result,
    };
  }

  async getSummary(accommodation_base_id: number) {
    const records = await this.model.findAll({
      where: { accommodation_base_id },
    });

    const totalRows = records.length;
    const totalPayments = records.reduce(
      (sum, r) => sum + Number(r.amount ?? 0),
      0,
    );
    const totalPaymentsFormatted = totalPayments.toFixed(2);

    return {
      success: true,
      message: 'Accommodation bill payments summary fetched successfully.',
      data: {
        totalRows,
        totalPayments: totalPaymentsFormatted,
      },
    };
  }

  async findOne(id: number) {
    const record = await this.model.findByPk(id, {
      include: ['accommodation'],
    });
    if (!record) throw new NotFoundException('Payment not found');
    return record;
  }

  async update(
    id: number,
    dto: UpdateAccommodationBillPaymentDto,
    files: Express.Multer.File[] = [],
    userId: number,
  ) {
    const record = await this.findOne(id);

    if (files.length > 0) {
      const results = await this.unifiedFileService.storeFiles(
        [files[0]],
        'Accommodation',
        'attachment',
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
        dto.attachment = results[0].storedPath;
      }
    }

    await record.update({
      ...dto,
      updated_by: userId,
    });

    return {
      message: 'Accommodation bill payment updated successfully',
      success: true,
    };
  }

  async remove(id: number) {
    const record = await this.findOne(id);
    return record.destroy();
  }
}
