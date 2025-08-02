// src/work-orders/work-order-parts/dto/create-work-order-part.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsInt,
  IsPositive,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWorkOrderPartDto {
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
    description: 'Work Order Service ID from work_order_services table',
    example: 25,
  })
  @IsNumber({}, { message: 'Work order service ID must be a number' })
  @IsInt({ message: 'Work order service ID must be an integer' })
  @IsPositive({ message: 'Work order service ID must be positive' })
  @IsNotEmpty({ message: 'Work order service ID is required' })
  work_order_service_id: number;

  @ApiProperty({
    description: 'Material/Part ID from materials table',
    example: 150,
  })
  @IsNumber({}, { message: 'Part ID must be a number' })
  @IsInt({ message: 'Part ID must be an integer' })
  @IsPositive({ message: 'Part ID must be positive' })
  @IsNotEmpty({ message: 'Part ID is required' })
  part_id: number;

  @ApiProperty({
    description: 'Quantity of parts used',
    example: 5,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @IsNotEmpty({ message: 'Quantity is required' })
  quantity: number;

  @ApiProperty({
    description: 'Unit price excluding VAT',
    example: 125.5,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Unit price must be a number' })
  @Min(0, { message: 'Unit price must be non-negative' })
  @IsNotEmpty({ message: 'Unit price is required' })
  unit_price: number;

  @ApiPropertyOptional({
    description: 'Warranty duration in days',
    example: 365,
    minimum: 0,
    default: 0,
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
    description:
      'Client approval status (defaults to false, typically not editable)',
    example: false,
    default: false,
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
    description: 'Approval timestamp (hidden field, auto-set when approved)',
    example: '2025-07-14T12:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Approved date must be a valid date string' })
  approved_date?: string;
}
