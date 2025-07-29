import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetMakeDto {
  @ApiProperty({ example: 'Toyota' })
  title: string;
}
