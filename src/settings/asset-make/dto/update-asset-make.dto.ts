import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAssetMakeDto {
  @ApiPropertyOptional({ example: 'Ford' })
  title?: string;
}
