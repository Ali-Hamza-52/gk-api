import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAssetTypeDto {
  @ApiProperty({ example: 'Excavator' })
  @IsString()
  @IsNotEmpty()
  title: string;
}
