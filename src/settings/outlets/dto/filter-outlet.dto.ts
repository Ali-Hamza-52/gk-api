import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterOutletDto {
  @ApiPropertyOptional({ example: 'Riyadh' })
  searchTerm?: string;

  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  perPage?: number;

  @ApiPropertyOptional({ example: 'Outlet A' })
  name?: string;

  @ApiPropertyOptional({ example: 'Jeddah' })
  city?: string;
}
