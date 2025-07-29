import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccommodationPaymentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  accommodation_base_id: number;

  @ApiProperty({ example: 2500 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2025-07-11' })
  @IsString()
  date: string;

  @ApiProperty({ required: false, example: 'Monthly rent for July' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false, example: '2025-07-01' })
  @IsOptional()
  @IsString()
  periodFrom?: string;

  @ApiProperty({ required: false, example: '2025-07-31' })
  @IsOptional()
  @IsString()
  periodTo?: string;

  @ApiProperty({ required: false, example: 'Bank Transfer' })
  @IsOptional()
  @IsString()
  rent_payment_method?: string;

  @ApiProperty({ required: false, example: 3000 })
  @IsOptional()
  @IsNumber()
  salary?: number;

  @ApiProperty({ required: false, example: 101 })
  @IsOptional()
  @IsNumber()
  employee_id?: number;

  // These fields are uploaded as files in multipart/form-data
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  attachment?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  rent_reciept?: string;
}
