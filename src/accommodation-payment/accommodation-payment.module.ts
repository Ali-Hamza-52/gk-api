// src/accommodation-payment/accommodation-payment.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccommodationPayment } from './entities/accommodation-payment.entity';
import { AccommodationPaymentService } from './accommodation-payment.service';
import { AccommodationPaymentController } from './accommodation-payment.controller';

@Module({
  imports: [SequelizeModule.forFeature([AccommodationPayment])],
  controllers: [AccommodationPaymentController],
  providers: [AccommodationPaymentService],
})
export class AccommodationPaymentModule {}
