import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetCapacityDto {
  @ApiProperty({ example: '5 tons' })
  title: string;
}
