import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { FmServiceCategory } from './create-fm-service-settings.dto';

export class FilterFmServiceSettingsDto {
  @ApiProperty({ required: false, description: 'Page number', example: 1 })
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  page?: number = 1;

  @ApiProperty({ required: false, description: 'Items per page', example: 10 })
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  limit?: number = 10;

  @ApiProperty({ required: false, description: 'Search by task name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by category',
    enum: FmServiceCategory,
  })
  @IsOptional()
  @IsEnum(FmServiceCategory)
  category?: FmServiceCategory;

  @ApiProperty({ required: false, description: 'Filter by active status' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ required: false, description: 'Filter by building type' })
  @IsOptional()
  @IsString()
  building_type?: string;
}
