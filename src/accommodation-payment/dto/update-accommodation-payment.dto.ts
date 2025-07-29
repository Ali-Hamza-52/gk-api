import { PartialType } from '@nestjs/swagger';
import { CreateAccommodationPaymentDto } from './create-accommodation-payment.dto';

export class UpdateAccommodationPaymentDto extends PartialType(
  CreateAccommodationPaymentDto,
) {}
