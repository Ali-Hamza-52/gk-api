import { ApiProperty } from '@nestjs/swagger';

export class CreateProfessionDto {
  @ApiProperty({ example: 'Electrician' })
  profession_en: string;

  @ApiProperty({ example: 'كهربائي' })
  profession_ar: string;
}
