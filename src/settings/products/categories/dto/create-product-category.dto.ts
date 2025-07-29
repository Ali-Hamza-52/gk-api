// src/products/categories/dto/create-product-category.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProductCategoryDto {
  @ApiProperty({ example: 'Forklift Services' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'خدمات الرافعات' })
  @IsString()
  title_ar: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  icon?: any;
}
