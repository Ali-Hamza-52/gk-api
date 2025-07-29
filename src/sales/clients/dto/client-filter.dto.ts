import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class ClientFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  perPage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  client_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  client_name_ar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address_ar?: string;

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
  ajeer_license?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dept_en?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dept_ar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contract?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contract_type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contract_status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fat_details?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rate1?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rate2?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  overtime_rate1?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  overtime_rate2?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  start_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  end_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  daysWeek?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hoursDay?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  account_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bank_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  iban?: string;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  sales_person?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  StreetName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  BuildingNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  District?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  CityName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  PostalZone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactNo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  billing_email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  billing_phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  billing_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hr_email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hr_phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hr_name?: string;
}
