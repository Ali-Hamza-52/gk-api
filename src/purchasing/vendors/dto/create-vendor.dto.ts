import { ApiProperty } from '@nestjs/swagger';
import { VendorServiceDto } from './vendor-Service.dto';
import { Type } from 'class-transformer';
import { IsOptional, IsArray, ValidateNested } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({ example: 'ABCD', description: 'Vendor code (up to 4 chars)' })
  code: string;

  @ApiProperty({ example: 'My Company', description: 'Vendor name' })
  name: string;

  @ApiProperty({ description: 'Company name (Arabic)', required: false })
  name_ar?: string;

  @ApiProperty({ example: 12345, description: 'CR Number', required: false })
  cr_no?: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  cr_file?: any;

  @ApiProperty({ example: 54321, description: 'VAT Number', required: false })
  vat_no?: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  vat_file?: any;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  contract?: any;

  @ApiProperty({ description: 'Contact operations', required: false })
  contact_ops?: string;

  @ApiProperty({
    example: '920000000',
    description: 'Operations phone',
    required: false,
  })
  contact_ops_no?: string;

  @ApiProperty({ description: 'Contact billing', required: false })
  contact_billing?: string;
  @ApiProperty({
    example: '920000001',
    description: 'Billing phone',
    required: false,
  })
  contact_billing_no?: string;

  @ApiProperty({ description: 'Contact government relations', required: false })
  contact_gov?: string;
  @ApiProperty({
    example: '920000002',
    description: 'Gov relations phone',
    required: false,
  })
  contact_gov_no?: string;

  @ApiProperty({
    type: [VendorServiceDto],
    required: false,
    description: 'List of vendor services',
  })
  services?: any;
}
