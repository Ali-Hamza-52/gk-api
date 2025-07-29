import { ApiProperty } from '@nestjs/swagger';

export class CreateWarehouseDto {
  @ApiProperty({ example: 'Central Warehouse' })
  name: string;

  @ApiProperty({ example: 'المستودع المركزي' })
  name_ar: string;

  @ApiProperty({ example: 'Riyadh' })
  city: string;

  @ApiProperty({ example: 'Warehouse Road, Riyadh' })
  address: string;

  @ApiProperty({ example: 'شارع المستودع، الرياض' })
  address_ar?: string;

  @ApiProperty({ example: '24.7136' })
  latitude?: string;

  @ApiProperty({ example: '46.6753' })
  longitude?: string;
}
