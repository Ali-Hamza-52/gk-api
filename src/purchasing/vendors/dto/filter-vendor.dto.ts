import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class FilterVendorDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  perPage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name_ar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  cr_no?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  vat_no?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contact_ops?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contact_billing?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contact_gov?: string;
}
