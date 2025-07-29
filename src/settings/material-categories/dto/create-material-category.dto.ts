// src/settings/material-categories/dto/create-material-category.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialCategoryDto {
  @ApiProperty({ example: 'Raw Material' })
  category_name: string;

  @ApiProperty({ example: 'Base ingredients used in manufacturing' })
  description: string;
}
