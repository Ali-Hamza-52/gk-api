import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({
    example: 'Senior Sales Manager',
    description: 'Updated name of the role',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'Senior manager overseeing sales operations',
    description: 'Updated description of the role',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the role is active',
    required: false,
  })
  is_active?: boolean;
}
