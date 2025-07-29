// src/accommodation-bill-payment/dto/update-accommodation-bill-payment.dto.ts

import { PartialType } from '@nestjs/swagger';
import { CreateAccommodationBillPaymentDto } from './create-accommodation-bill-payment.dto';

export class UpdateAccommodationBillPaymentDto extends PartialType(
  CreateAccommodationBillPaymentDto,
) {}
