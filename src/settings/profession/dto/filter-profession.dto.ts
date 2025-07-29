import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterProfessionDto {
  @ApiPropertyOptional({
    example: 'Electrician',
    description: 'Search term for filtering by profession_en',
  })
  searchTerm?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  page?: number;

  @ApiPropertyOptional({
    example: 15,
    description: 'Items per page for pagination',
  })
  perPage?: number;
}
