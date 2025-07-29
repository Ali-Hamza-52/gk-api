import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateAccommodationDto {
  @ApiProperty({ example: 'Al Yamama Building' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'Olaya' })
  @IsOptional()
  @IsString()
  location: string;

  @ApiProperty({ required: false, example: 'Riyadh' })
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty({ required: false, example: '123 Main Street' })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @IsNumber()
  rooms: number;

  @ApiProperty({ required: false, example: 20 })
  @IsOptional()
  @IsNumber()
  beds: number;

  @ApiProperty({ required: false, example: '2025-01-01' })
  @IsOptional()
  @IsString()
  contract_startdate: string;

  @ApiProperty({ required: false, example: '2026-01-01' })
  @IsOptional()
  @IsString()
  contract_enddate: string;

  @ApiProperty({ required: false, example: 50000 })
  @IsOptional()
  @IsNumber()
  rent: number;

  @ApiProperty({ required: false, example: 'Electricity, Water, Security' })
  @IsOptional()
  @IsString()
  services: string;

  @ApiProperty({ required: false, example: '2025-10-01' })
  @IsOptional()
  @IsString()
  dueDate: string;

  @ApiProperty({ required: false, example: 'Monthly' })
  @IsOptional()
  @IsString()
  period: string;

  @ApiProperty({ required: false, example: 'Apartment A-12' })
  @IsOptional()
  @IsString()
  apartment: string;

  @ApiProperty({ required: false, example: '12345678' })
  @IsOptional()
  @IsString()
  electricityAccountNo: string;

  @ApiProperty({ required: false, example: '12345678' })
  @IsOptional()
  @IsString()
  waterBillAccountNo: string;

  @ApiProperty({ required: false, example: 'Ahmed Ali' })
  @IsOptional()
  @IsString()
  contactName: string;

  @ApiProperty({ required: false, example: '+966500000000' })
  @IsOptional()
  @IsString()
  contactNo: string;

  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional()
  @IsString()
  accountName: string;

  @ApiProperty({ required: false, example: 'Riyad Bank' })
  @IsOptional()
  @IsString()
  bankName: string;

  @ApiProperty({ required: false, example: 'SA4420000001234567890001' })
  @IsOptional()
  @IsString()
  iban: string;

  @ApiProperty({ required: false, example: 250 })
  @IsOptional()
  @IsNumber()
  fixedElectricityAmount: number;

  @ApiProperty({ required: false, example: 150 })
  @IsOptional()
  @IsNumber()
  fixedWaterAmount: number;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  contract_attachment?: any;

  @ApiProperty({ required: false, example: 'Annual' })
  @IsOptional()
  @IsString()
  contract_type: string;

  @ApiProperty({ required: false, example: 'Bank Transfer' })
  @IsOptional()
  @IsString()
  rent_payment_method: string;

  @ApiProperty({ required: false, example: 3000 })
  @IsOptional()
  @IsNumber()
  salary: number;

  @ApiProperty({ required: false, example: 123 })
  @IsOptional()
  @IsNumber()
  employee_id: number;

  @ApiProperty({ required: false, example: 'Active' })
  @IsOptional()
  @IsString()
  accommodation_status: string;

  @ApiProperty({ required: false, example: '1001' })
  @IsOptional()
  @IsString()
  contract_number: string;

  @ApiProperty({ required: false, example: 'Near the shopping mall' })
  @IsOptional()
  @IsString()
  notes: string;

  @ApiProperty({ required: false, example: '24.7136' })
  @IsOptional()
  @IsString()
  lat: string;

  @ApiProperty({ required: false, example: '46.6753' })
  @IsOptional()
  @IsString()
  lng: string;
}
