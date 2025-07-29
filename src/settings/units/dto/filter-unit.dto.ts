import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterUnitDto {
  @ApiPropertyOptional({ example: 'KG' })
  searchTerm?: string;

  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 15 })
  perPage?: number;
}
