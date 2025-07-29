// src/assets/dto/create-asset.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

// Handle empty strings for date fields
const EmptyStringToNull = () =>
  Transform(({ value }) => (value === '' ? null : value));

// Handle empty strings / null for number fields
const EmptyStringToNullNumber = () =>
  Transform(({ value }) =>
    value === '' || value == null ? null : Number(value),
  );

export class CreateAssetDto {
  @ApiProperty({ example: 42, description: 'Vendor ID' })
  @IsNumber()
  vendor_id: number;

  @ApiProperty({ example: 'Forklift X200', description: 'Asset name' })
  @IsString()
  asset_name: string;

  @ApiProperty({ example: 'SN-123456789', description: 'Serial number' })
  @IsString()
  serial: string;

  @ApiProperty({ example: 3, description: 'Asset type ID' })
  @IsNumber()
  asset_type_id: number;

  @ApiProperty({ example: 7, description: 'Asset make ID' })
  @IsNumber()
  asset_make_id: number;

  @ApiProperty({ example: 'Model Z', description: 'Asset model' })
  @IsString()
  asset_model: string;

  @ApiProperty({ example: 2021, description: 'Year of manufacture' })
  @IsNumber()
  year: number;

  @ApiProperty({ example: 2, description: 'Asset capacity ID' })
  @IsNumber()
  asset_capacity_id: number;

  @ApiProperty({ example: 'Diesel', description: 'Fuel type' })
  @IsString()
  fuel_type: string;

  @ApiProperty({ example: '2022-06-15', description: 'Purchase date' })
  @IsDateString()
  @EmptyStringToNull()
  purchase_date: string;

  @ApiProperty({ example: 15000, description: 'Purchase price excl. VAT' })
  @IsNumber()
  @EmptyStringToNullNumber()
  purchase_price_excl_vat: number;

  @ApiProperty({ example: '2025-06-15', description: 'Warranty expiry date' })
  @IsDateString()
  @EmptyStringToNull()
  warranty_expiry_date: string;

  @ApiProperty({ example: 5, description: 'Useful life (years)' })
  @IsNumber()
  @EmptyStringToNullNumber()
  useful_life: number;

  @ApiProperty({ example: 'Heavy lifting', description: 'Usages description' })
  @IsString()
  usages: string;

  @ApiProperty({ example: 'Warehouse A', description: 'Initial location' })
  @IsString()
  location: string;

  @ApiProperty({ example: 12345, description: 'Odometer reading' })
  @IsNumber()
  @EmptyStringToNullNumber()
  odo_meter_reading: number;

  @ApiProperty({ example: 'Active', description: 'Current status' })
  @IsString()
  status: string;

  @ApiProperty({
    example: 1,
    description: 'Category (0=Non-Operating,1=Operating)',
  })
  @IsNumber()
  @EmptyStringToNullNumber()
  category: number;

  @ApiProperty({ example: 'Site B', description: 'Current location details' })
  @IsString()
  current_location: string;

  @ApiPropertyOptional({
    example: 'Needs quarterly check',
    description: 'Additional notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 24.7136, description: 'Latitude' })
  @IsOptional()
  @EmptyStringToNullNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 46.6753, description: 'Longitude' })
  @IsOptional()
  @EmptyStringToNullNumber()
  lng?: number;

  // ——— file uploads ———

  @ApiPropertyOptional({
    description: 'Front image file',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  front_image?: any;

  @ApiPropertyOptional({
    description: 'Back image file',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  back_image?: any;

  @ApiPropertyOptional({
    description: 'Left side image file',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  left_image?: any;

  @ApiPropertyOptional({
    description: 'Right side image file',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  right_image?: any;

  @ApiPropertyOptional({
    description: 'Warranty documents (PDF/image)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  warranty_documents?: any;

  @ApiPropertyOptional({
    description: 'Invoice documents (PDF/image)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  invoice_documents?: any;
}
