import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ClientEntity } from './client.entity';

@Table({ tableName: 'client_locations', timestamps: false })
export class ClientLocationEntity extends Model {
  @ApiProperty()
  @ForeignKey(() => ClientEntity)
  @Column({ type: DataType.INTEGER })
  declare client_code: number;

  @ApiProperty()
  @Column
  declare location_name: string;

  @ApiProperty()
  @Column
  declare location_name_ar?: string;

  @ApiProperty()
  @Column
  declare latitude?: string;

  @ApiProperty()
  @Column
  declare longitude?: string;

  @ApiProperty()
  @Column
  declare location_map?: string;
}
