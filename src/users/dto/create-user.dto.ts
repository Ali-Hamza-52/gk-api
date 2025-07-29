// src/users/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNumber()
  pin: number;

  @ApiProperty()
  @IsBoolean()
  isPinLocked: boolean;

  @ApiProperty()
  @IsString()
  userlevel: string;

  @ApiProperty()
  @IsString()
  activated: string;

  @ApiProperty()
  @IsString()
  user_name: string;

  @ApiProperty()
  @IsString()
  mobile: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsNumber()
  employee_id: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fcm_token?: string;
}
