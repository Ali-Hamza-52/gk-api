// src/settings/materials/dto/filter-material.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterMaterialDto {
  @ApiPropertyOptional({ example: 'flour' })
  searchTerm?: string;

  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  perPage?: number;
}
