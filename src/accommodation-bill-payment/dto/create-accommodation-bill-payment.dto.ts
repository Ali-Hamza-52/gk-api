import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccommodationBillPaymentDto {
  @ApiProperty({
    example: 1,
    description: 'ID of the accommodation this bill belongs to',
  })
  @IsNumber()
  accommodation_base_id: number;

  @ApiProperty({ example: 750.5, description: 'Amount of the bill payment' })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: '2025-07-01',
    description: 'Date of the bill payment (YYYY-MM-DD)',
  })
  @IsString()
  date: string;

  @ApiProperty({
    example: 'Electricity',
    description: 'Type of the bill (e.g., Electricity, Water)',
  })
  @IsString()
  billType: string;

  @ApiProperty({
    example: 'July 2025',
    description: 'Billing month name or label',
  })
  @IsString()
  billMonth: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Upload the bill receipt or attachment file',
  })
  @IsOptional()
  attachment?: any;

  @ApiProperty({
    required: false,
    example: 'Payment made via bank transfer',
    description: 'Optional notes about this payment',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
