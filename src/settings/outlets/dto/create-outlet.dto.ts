import { ApiProperty } from '@nestjs/swagger';

export class CreateOutletDto {
  @ApiProperty({ example: 'Riyadh Outlet' })
  name: string;

  @ApiProperty({ example: 'فرع الرياض' })
  name_ar: string;

  @ApiProperty({ example: 'Riyadh' })
  city: string;

  @ApiProperty({ example: 'King Fahad Road, Riyadh' })
  address: string;

  @ApiProperty({ example: 'طريق الملك فهد، الرياض' })
  address_ar?: string;

  @ApiProperty({ example: '24.7136' })
  latitude?: string;

  @ApiProperty({ example: '46.6753' })
  longitude?: string;
}
