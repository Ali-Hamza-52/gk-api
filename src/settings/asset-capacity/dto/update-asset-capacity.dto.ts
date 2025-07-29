import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAssetCapacityDto {
  @ApiPropertyOptional({ example: '10 tons' })
  title?: string;
}
