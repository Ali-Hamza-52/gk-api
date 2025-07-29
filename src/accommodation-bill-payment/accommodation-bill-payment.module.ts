// src/accommodation-bill-payment/accommodation-bill-payment.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccommodationBillPayment } from './entities/accommodation-bill-payment.entity';
import { AccommodationBillPaymentService } from './accommodation-bill-payment.service';
import { AccommodationBillPaymentController } from './accommodation-bill-payment.controller';

@Module({
  imports: [SequelizeModule.forFeature([AccommodationBillPayment])],
  controllers: [AccommodationBillPaymentController],
  providers: [AccommodationBillPaymentService],
})
export class AccommodationBillPaymentModule {}
