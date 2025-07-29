import { ApiProperty } from '@nestjs/swagger';

export class CreateUnitDto {
  @ApiProperty({ example: 'KG' })
  unit_code: string;

  @ApiProperty({ example: 'Kilogram' })
  unit_name: string;
}
