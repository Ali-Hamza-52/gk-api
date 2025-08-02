// src/work-orders/work-order-parts/dto/update-work-order-part.dto.ts

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateWorkOrderPartDto } from './create-work-order-part.dto';
import {
  IsNumber,
  IsInt,
  IsPositive,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateWorkOrderPartDto extends PartialType(
  CreateWorkOrderPartDto,
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
    description: 'Work Order Service ID from work_order_services table',
    example: 25,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Work order service ID must be a number' })
  @IsInt({ message: 'Work order service ID must be an integer' })
  @IsPositive({ message: 'Work order service ID must be positive' })
  work_order_service_id?: number;

  @ApiPropertyOptional({
    description: 'Material/Part ID from materials table',
    example: 150,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Part ID must be a number' })
  @IsInt({ message: 'Part ID must be an integer' })
  @IsPositive({ message: 'Part ID must be positive' })
  part_id?: number;

  @ApiPropertyOptional({
    description: 'Quantity of parts used',
    example: 5,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Unit price excluding VAT',
    example: 125.5,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Unit price must be a number' })
  @Min(0, { message: 'Unit price must be non-negative' })
  unit_price?: number;

  @ApiPropertyOptional({
    description: 'Warranty duration in days',
    example: 365,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Warranty duration must be a number' })
  @IsInt({ message: 'Warranty duration must be an integer' })
  @Min(0, { message: 'Warranty duration must be non-negative' })
  @Max(3650, {
    message: 'Warranty duration cannot exceed 10 years (3650 days)',
  })
  warranty_duration?: number;

  @ApiPropertyOptional({
    description: 'Supplier ID from suppliers table',
    example: 42,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Supplier ID must be a number' })
  @IsInt({ message: 'Supplier ID must be an integer' })
  @IsPositive({ message: 'Supplier ID must be positive' })
  supplier_id?: number;

  @ApiPropertyOptional({
    description: 'Client approval status',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Approved by client must be a boolean' })
  approved_by_client?: boolean;

  @ApiPropertyOptional({
    description: 'User ID who approved the part',
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

// Separate DTO for PATCH operations (identical to UpdateWorkOrderPartDto but with explicit naming)
export class PatchWorkOrderPartDto extends PartialType(
  CreateWorkOrderPartDto,
) {}
