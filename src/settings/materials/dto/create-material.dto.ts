// src/settings/materials/dto/create-material.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialDto {
  @ApiProperty({ example: 'Flour' })
  name: string;

  @ApiProperty({ example: 1 })
  category_id: number;

  @ApiProperty({ example: 1 })
  purchase_unit_id: number;

  @ApiProperty({ example: 2 })
  consumption_unit_id: number;

  @ApiProperty({ example: 10 })
  conversion_ratio: number;

  @ApiProperty({ example: 50 })
  re_order_qty: number;

  @ApiProperty({ example: 1 })
  stock_control: number;
}
