import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import {
  ServiceCategory,
  PricingType,
} from '../entities/client-pricing-rule.entity';

export class FilterClientPricingRuleDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  perPage?: number;

  @ApiPropertyOptional({ description: 'Search by ID or client code' })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({ example: 1001, description: 'Filter by client code' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  client_code?: number;

  @ApiPropertyOptional({
    enum: ServiceCategory,
    description: 'Filter by service category',
  })
  @IsOptional()
  @IsEnum(ServiceCategory)
  category?: ServiceCategory;

  @ApiPropertyOptional({
    enum: PricingType,
    description: 'Filter by pricing type',
  })
  @IsOptional()
  @IsEnum(PricingType)
  pricingType?: PricingType;
}
