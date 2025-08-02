// src/work-orders/work-order-addons/dto/create-work-order-addon.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsInt,
  IsPositive,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsString,
  IsEnum,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddonType } from '../entities/work-order-addon.entity';

export class CreateWorkOrderAddonDto {
  @ApiProperty({
    description: 'Work Order ID from work_orders table',
    example: 1012,
  })
  @IsNumber({}, { message: 'Work order ID must be a number' })
  @IsInt({ message: 'Work order ID must be an integer' })
  @IsPositive({ message: 'Work order ID must be positive' })
  @IsNotEmpty({ message: 'Work order ID is required' })
  work_order_id: number;

  @ApiProperty({
    description: 'Type of addon',
    enum: AddonType,
    example: AddonType.Platform,
  })
  @IsEnum(AddonType, {
    message: `Addon type must be one of the following values: ${Object.values(AddonType).join(', ')}`,
  })
  @IsNotEmpty({ message: 'Addon type is required' })
  addon_type: AddonType;

  @ApiProperty({
    description: 'Description of the addon',
    example: 'Mobile platform for high-level maintenance work',
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({
    description: 'Price excluding VAT',
    example: 1500.75,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be non-negative' })
  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @ApiPropertyOptional({
    description:
      'Client approval status (defaults to false, typically not editable)',
    example: false,
    default: false,
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
    description: 'Approval timestamp (hidden field, auto-set when approved)',
    example: '2025-07-14T12:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Approved date must be a valid date string' })
  approved_date?: string;
}
