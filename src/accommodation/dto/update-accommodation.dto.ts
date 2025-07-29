// src/accommodation/dto/update-accommodation.dto.ts

import { PartialType } from '@nestjs/swagger';
import { CreateAccommodationDto } from './create-accommodation.dto';

export class UpdateAccommodationDto extends PartialType(
  CreateAccommodationDto,
) {}
