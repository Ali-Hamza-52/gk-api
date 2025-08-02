// src/work-orders/work-order-addons/dto/filter-work-order-addon.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsInt,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { AddonType } from '../entities/work-order-addon.entity';

export class FilterWorkOrderAddonDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'PerPage must be a number' })
  @IsInt({ message: 'PerPage must be an integer' })
  @Min(1, { message: 'PerPage must be at least 1' })
  @Max(100, { message: 'PerPage must be at most 100' })
  perPage?: number;

  @ApiPropertyOptional({
    description:
      'Search term - searches across Addon ID, Work Order ID, Description',
  })
  @IsOptional()
  @IsString({ message: 'Search term must be a string' })
  searchTerm?: string;

  @ApiPropertyOptional({
    description: 'Filter by Addon Type',
    enum: AddonType,
  })
  @IsOptional()
  @IsEnum(AddonType, {
    message: `Addon type must be one of the following values: ${Object.values(AddonType).join(', ')}`,
  })
  addon_type?: AddonType;
}
