import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Sales Manager',
    description: 'Name of the role',
  })
  name: string;

  @ApiProperty({
    example: 'Manages sales team and client relationships',
    description: 'Description of the role',
    required: false,
  })
  description?: string;
}
