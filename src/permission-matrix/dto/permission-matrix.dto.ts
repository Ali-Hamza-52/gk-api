import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionMatrixDto {
  @ApiProperty({
    example: {
      employees: 'C,E,V',
      clients: 'C,E,V,D',
      vendors: 'V',
    },
    description: 'Object containing module permissions',
  })
  permissions: Record<string, string>;
}
