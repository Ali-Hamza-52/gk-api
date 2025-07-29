// src/settings/material-categories/dto/filter-material-category.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterMaterialCategoryDto {
  @ApiPropertyOptional({ example: 'raw' })
  searchTerm?: string;

  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  perPage?: number;
}
