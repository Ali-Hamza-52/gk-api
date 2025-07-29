// src/vendors/dto/vendor-service.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VendorServiceDto {
  @ApiProperty({ example: 'Cleaning' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Monthly' })
  @IsString()
  period: string;

  @ApiProperty({ example: '1500' })
  @IsString()
  rate: string;
}
