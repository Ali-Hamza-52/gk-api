import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterWarehouseDto {
  @ApiPropertyOptional({ example: 'Riyadh' })
  searchTerm?: string;

  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  perPage?: number;

  @ApiPropertyOptional({ example: 'Central Warehouse' })
  name?: string;

  @ApiPropertyOptional({ example: 'Jeddah' })
  city?: string;
}
