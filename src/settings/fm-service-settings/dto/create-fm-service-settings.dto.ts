import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsPositive,
  Min,
  Max,
} from 'class-validator';

export enum FmServiceCategory {
  HVAC = 'HVAC',
  PLUMBING = 'Plumbing',
  ELECTRICAL = 'Electrical',
  ELECTRONICS = 'Electronics',
  CLEANING = 'Cleaning',
  PEST_CONTROL = 'Pest Control',
  LANDSCAPING = 'Landscaping',
  CIVIL = 'Civil',
}

export class CreateFmServiceSettingsDto {
  @ApiProperty({
    description: 'Task name',
    example: 'Split AC Filter Cleaning',
  })
  @IsString()
  @IsNotEmpty()
  task_name: string;

  @ApiProperty({
    description: 'Service category',
    enum: FmServiceCategory,
    example: FmServiceCategory.HVAC,
  })
  @IsEnum(FmServiceCategory)
  @IsNotEmpty()
  category: FmServiceCategory;

  @ApiProperty({
    description: 'Default duration in hours',
    example: 2.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  default_duration_hrs?: number;

  @ApiProperty({
    description: 'Default material cost',
    example: 150.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  default_material_cost?: number;

  @ApiProperty({
    description: 'Whether custom pricing is enabled',
    example: false,
  })
  @IsBoolean()
  custom_pricing: boolean;

  @ApiProperty({
    description: 'Service price excluding VAT',
    example: 250.0,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Priority level (1-5)',
    example: 3,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  priority: number;

  @ApiProperty({
    description: 'SLA time frame in hours',
    example: 24.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  sla?: number;

  @ApiProperty({
    description: 'Applicable building types',
    example: 'Residential, Commercial',
  })
  @IsString()
  @IsNotEmpty()
  building_type: string;

  @ApiProperty({
    description: 'Whether service is active',
    example: true,
  })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Regular maintenance service',
  })
  @IsString()
  @IsNotEmpty()
  notes: string;
}
