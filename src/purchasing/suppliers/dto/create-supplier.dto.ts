import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({ default: 'Al Jazeera Co.' }) name: string;
  @ApiProperty({ default: 'شركة الجزيرة' }) name_ar: string;
  @ApiProperty({ default: '123456789' }) vat_number: string;
  @ApiProperty({ default: 'CR12345' }) cr_number?: string;
  @ApiProperty({ default: 'Ali Ahmed' }) contact_name?: string;
  @ApiProperty({ default: '0567891234' }) contact_number?: string;
  @ApiProperty({ default: 'Riyadh' }) city?: string;
  @ApiProperty({ default: 'Al Rajhi Bank' }) bank_name?: string;
  @ApiProperty({ default: 'Al Jazeera Ltd' }) account_name?: string;
  @ApiProperty({ default: 'SA4420000001234567891234' }) iban?: string;
  @ApiProperty({ default: [1, 2], description: 'Supplier Type IDs' })
  supplier_types: number[];
}
