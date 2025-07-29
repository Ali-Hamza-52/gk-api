import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({
    example: 'JavaScript',
    description: 'English name for the skill',
  })
  @IsNotEmpty()
  name_en: string;

  @ApiProperty({
    example: 'جافاسكريبت',
    description: 'Arabic name for the skill',
  })
  @IsNotEmpty()
  name_ar: string;
}
