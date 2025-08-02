// src/work-orders/work-order-parts/dto/filter-work-order-part.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsInt,
  IsPositive,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class FilterWorkOrderPartDto {
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
      'Search term - searches across Part ID, Work Order ID, Work Order Service ID, Material Name',
  })
  @IsOptional()
  @IsString({ message: 'Search term must be a string' })
  searchTerm?: string;

  @ApiPropertyOptional({
    description: 'Filter by Work Order Part ID',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'ID must be a number' })
  @IsInt({ message: 'ID must be an integer' })
  @IsPositive({ message: 'ID must be positive' })
  id?: number;

  @ApiPropertyOptional({
    description: 'Filter by Work Order ID',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Work order ID must be a number' })
  @IsInt({ message: 'Work order ID must be an integer' })
  @IsPositive({ message: 'Work order ID must be positive' })
  work_order_id?: number;

  @ApiPropertyOptional({
    description: 'Filter by Work Order Service ID',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Work order service ID must be a number' })
  @IsInt({ message: 'Work order service ID must be an integer' })
  @IsPositive({ message: 'Work order service ID must be positive' })
  work_order_service_id?: number;

  @ApiPropertyOptional({
    description: 'Filter by client approval status',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Approved by client must be a boolean' })
  approved_by_client?: boolean;
}
