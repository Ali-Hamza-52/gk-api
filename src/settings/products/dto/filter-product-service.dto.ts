import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterProductServiceDto {
  @ApiPropertyOptional({ example: 'Water' }) searchTerm?: string;
  @ApiPropertyOptional({ example: 1 }) page?: number;
  @ApiPropertyOptional({ example: 10 }) perPage?: number;
}
