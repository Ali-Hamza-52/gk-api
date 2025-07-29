import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterAssetCapacityDto {
  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  perPage?: number;

  @ApiPropertyOptional()
  searchTerm?: string;
}
