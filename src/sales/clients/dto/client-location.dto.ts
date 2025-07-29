import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ClientLocationDto {
  @ApiProperty({ required: false }) @IsOptional() id?: number;

  @ApiProperty() @IsString() location_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location_name_ar?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() latitude?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  longitude?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location_map?: string;
}
