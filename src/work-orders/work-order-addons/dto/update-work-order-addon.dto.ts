// src/work-orders/work-order-addons/dto/update-work-order-addon.dto.ts

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateWorkOrderAddonDto } from './create-work-order-addon.dto';
import {
  IsNumber,
  IsInt,
  IsPositive,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsString,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddonType } from '../entities/work-order-addon.entity';

export class UpdateWorkOrderAddonDto extends PartialType(
  CreateWorkOrderAddonDto,
) {
  @ApiPropertyOptional({
    description: 'Work Order ID from work_orders table',
    example: 1012,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Work order ID must be a number' })
  @IsInt({ message: 'Work order ID must be an integer' })
  @IsPositive({ message: 'Work order ID must be positive' })
  work_order_id?: number;

  @ApiPropertyOptional({
    description: 'Type of addon',
    enum: AddonType,
    example: AddonType.Platform,
  })
  @IsOptional()
  @IsEnum(AddonType, {
    message: `Addon type must be one of the following values: ${Object.values(AddonType).join(', ')}`,
  })
  addon_type?: AddonType;

  @ApiPropertyOptional({
    description: 'Description of the addon',
    example: 'Mobile platform for high-level maintenance work',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Price excluding VAT',
    example: 1500.75,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be non-negative' })
  price?: number;

  @ApiPropertyOptional({
    description: 'Client approval status',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Approved by client must be a boolean' })
  approved_by_client?: boolean;

  @ApiPropertyOptional({
    description: 'User ID who approved the addon',
    example: 101,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Approved by user ID must be a number' })
  @IsInt({ message: 'Approved by user ID must be an integer' })
  @IsPositive({ message: 'Approved by user ID must be positive' })
  approved_by_userid?: number;

  @ApiPropertyOptional({
    description: 'Approval timestamp',
    example: '2025-07-14T12:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Approved date must be a valid date string' })
  approved_date?: string;
}

// Separate DTO for PATCH operations
export class PatchWorkOrderAddonDto extends PartialType(
  CreateWorkOrderAddonDto,
) {}
