import { IsOptional, IsString } from 'class-validator';

export class FilterSupplierDto {
  @IsOptional() @IsString() searchTerm?: string;
  @IsOptional() @IsString() supplierType?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() bank_name?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() vat_number?: string;
  @IsOptional() @IsString() cr_number?: string;
  @IsOptional() @IsString() contact_number?: string;
  @IsOptional() @IsString() iban?: string;

  @IsOptional() page_no?: number;
  @IsOptional() perPage?: number;
}
