import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';

export class FilterAssetDto {
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() perPage?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() searchTerm?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber() year?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() vendor_id?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() asset_type_id?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() asset_make_id?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() asset_capacity_id?: number;

  @ApiPropertyOptional() @IsOptional() @IsString() asset_model?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fuel_type?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() purchase_date?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  purchase_price_excl_vat?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  warranty_expiry_date?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() useful_life?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() usages?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() current_location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() odo_meter_reading?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() category?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() lat?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() lng?: number;
}
