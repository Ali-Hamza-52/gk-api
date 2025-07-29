import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ClientServiceDto } from './client-service.dto';
import { ClientLocationDto } from './client-location.dto';

export class CreateClientDto {
  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  client_name: string;

  @ApiProperty({ required: false, example: 'شركة أكمي' })
  @IsOptional()
  @IsString()
  client_name_ar?: string;

  @ApiProperty({ required: false, example: '123 Main Street' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, example: '١٢٣ الشارع الرئيسي' })
  @IsOptional()
  @IsString()
  address_ar?: string;

  @ApiProperty({ required: false, example: 123456 })
  @IsOptional()
  @IsNumber()
  cr_no?: number;

  @ApiProperty({ required: false, example: 789012 })
  @IsOptional()
  @IsNumber()
  vat_no?: number;

  // Files (no examples)
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  cr?: any;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  vat_cert?: any;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  ajeer_license?: any;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  contract?: any;

  @ApiProperty({ required: false, example: 'HR Department' })
  @IsOptional()
  @IsString()
  dept_en?: string;

  @ApiProperty({ required: false, example: 'قسم الموارد البشرية' })
  @IsOptional()
  @IsString()
  dept_ar?: string;

  @ApiProperty({ required: false, example: 'Monthly' })
  @IsOptional()
  @IsString()
  contract_type?: string;

  @ApiProperty({ required: false, example: 'Active' })
  @IsOptional()
  @IsString()
  contract_status?: string;

  @ApiProperty({ required: false, example: 'Includes housing & transport' })
  @IsOptional()
  @IsString()
  fat_details?: string;

  @ApiProperty({ required: false, example: 5000 })
  @IsOptional()
  @IsNumber()
  rate1?: number;

  @ApiProperty({ required: false, example: 5500 })
  @IsOptional()
  @IsNumber()
  rate2?: number;

  @ApiProperty({ required: false, example: 50 })
  @IsOptional()
  @IsNumber()
  overtime_rate1?: number;

  @ApiProperty({ required: false, example: 60 })
  @IsOptional()
  @IsNumber()
  overtime_rate2?: number;

  @ApiProperty({ required: false, example: '2025-01-01' })
  @IsOptional()
  @IsString()
  start_date?: string;

  @ApiProperty({ required: false, example: '2025-12-31' })
  @IsOptional()
  @IsString()
  end_date?: string;

  @ApiProperty({ required: false, example: '1 Day' })
  @IsOptional()
  @IsString()
  daysWeek?: string;

  @ApiProperty({ required: false, example: '8' })
  @IsOptional()
  @IsString()
  hoursDay?: string;

  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional()
  @IsString()
  account_name?: string;

  @ApiProperty({ required: false, example: 'Riyad Bank' })
  @IsOptional()
  @IsString()
  bank_name?: string;

  @ApiProperty({ required: false, example: 'SA4420000001234567890001' })
  @IsOptional()
  @IsString()
  iban?: string;

  @ApiProperty({ required: false, type: [Number], example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  sales_person?: number[];

  @ApiProperty({ required: false, example: 'Street 1' })
  @IsOptional()
  @IsString()
  StreetName?: string;

  @ApiProperty({ required: false, example: 'Building 12A' })
  @IsOptional()
  @IsString()
  BuildingNumber?: string;

  @ApiProperty({ required: false, example: 'Olaya' })
  @IsOptional()
  @IsString()
  District?: string;

  @ApiProperty({ required: false, example: 'Riyadh' })
  @IsOptional()
  @IsString()
  CityName?: string;

  @ApiProperty({ required: false, example: '12345' })
  @IsOptional()
  @IsString()
  PostalZone?: string;

  @ApiProperty({ required: false, example: 'Ahmed Ali' })
  @IsOptional()
  @IsString()
  contactName?: string;

  @ApiProperty({ required: false, example: '+966501234567' })
  @IsOptional()
  @IsString()
  contactNo?: string;

  @ApiProperty({ required: false, example: 'ahmed@example.com' })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiProperty({ required: false, example: 'billing@example.com' })
  @IsOptional()
  @IsString()
  billing_email?: string;

  @ApiProperty({ required: false, example: '+966511223344' })
  @IsOptional()
  @IsString()
  billing_phone?: string;

  @ApiProperty({ required: false, example: 'Billing Dept.' })
  @IsOptional()
  @IsString()
  billing_name?: string;

  @ApiProperty({ required: false, example: 'hr@example.com' })
  @IsOptional()
  @IsString()
  hr_email?: string;

  @ApiProperty({ required: false, example: '+966533445566' })
  @IsOptional()
  @IsString()
  hr_phone?: string;

  @ApiProperty({ required: false, example: 'HR Manager' })
  @IsOptional()
  @IsString()
  hr_name?: string;

  @ApiProperty({
    required: false,
    type: [ClientServiceDto],
    example: [
      {
        name: 'Cleaning',
        period: 'Monthly',
        rate: 1000,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientServiceDto)
  services?: ClientServiceDto[];

  @ApiProperty({
    required: false,
    type: [ClientLocationDto],
    example: [
      {
        location_name: 'Head Office',
        latitude: '24.123',
        longitude: '46.678',
        location_map: 'https://maps.example.com/head-office',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClientLocationDto)
  locations?: ClientLocationDto[];
}
