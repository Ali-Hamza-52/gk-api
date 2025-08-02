// src/auth/dto/login.dto.ts
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'dev@glorek.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'glorek',
    description: 'User password',
  })
  @IsString()
  password: string;
}
