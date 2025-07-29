import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ClientServiceDto {
  @ApiProperty({ required: false }) @IsOptional() id?: number;

  @ApiProperty() @IsString() name: string;

  @ApiProperty() @IsString() period: string;

  @ApiProperty() @IsNumber() rate: number;
}
