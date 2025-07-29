import { ApiProperty } from '@nestjs/swagger';

export class FilterRoleDto {
  @ApiProperty({
    example: 1,
    description: 'Page number for pagination',
    required: false,
  })
  page?: number;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
  })
  perPage?: number;

  @ApiProperty({
    example: 'manager',
    description: 'Search term for role name',
    required: false,
  })
  search?: string;

  @ApiProperty({
    example: true,
    description: 'Filter by active status',
    required: false,
  })
  is_active?: boolean;
}
