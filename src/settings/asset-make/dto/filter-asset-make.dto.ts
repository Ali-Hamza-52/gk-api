import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterAssetMakeDto {
  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  perPage?: number;

  @ApiPropertyOptional()
  searchTerm?: string;
}
