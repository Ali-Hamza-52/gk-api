import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({
    example: 1,
    description: 'Role ID to assign to user',
  })
  role_id: number;
}

export class BulkAssignRoleDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of user IDs',
  })
  user_ids: number[];

  @ApiProperty({
    example: 2,
    description: 'Role ID to assign to all users',
  })
  role_id: number;
}
