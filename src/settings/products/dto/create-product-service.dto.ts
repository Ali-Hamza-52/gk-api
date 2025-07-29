import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';

export class CreateProductServiceDto {
  @ApiProperty({ example: 'Water Bottle' }) name: string;
  @ApiProperty({ example: 'زجاجة ماء' }) name_ar: string;
  @ApiProperty({ example: 'Active' }) status: string;
  @ApiProperty({ example: 'Product' }) type: string;
  @ApiProperty({ example: 12.5 }) price: number;
  @ApiProperty({ example: '[{"size":"1L","price":12.50}]' })
  product_variations: string;
  @ApiProperty({ example: 'products/thumbnail_1.png' }) thumbnail: string;
  @ApiProperty({ example: 'Fixed' }) price_type: string;
  @ApiProperty({ example: 'Piece' }) inventory_unit: string;
  @ApiProperty({ example: 1 }) category_id: number;
  @ApiProperty({ example: 'QR' }) barcode_type: string;
  @ApiProperty({ example: 1 }) purchase_unit_id: number;
  @ApiProperty({ example: 2 }) consumption_unit_id: number;
  @ApiProperty({ example: '1234567890123' }) barcode: string;
  @ApiProperty({ example: 'WTR-001' }) sku: string;
  @ApiProperty({ example: 'Yes' }) pos_status: string;
  @IsOptional()
  @IsIn([0, 1])
  @ApiProperty({
    example: 1,
    enum: [0, 1],
    description: '0 = Disabled, 1 = Enabled',
  })
  stock_control?: number;

  @ApiProperty({ example: 1 }) availability_in_outlets: number;
}
