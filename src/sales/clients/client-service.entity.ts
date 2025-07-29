import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ClientEntity } from './client.entity';

@Table({ tableName: 'client_services', timestamps: false })
export class ClientServiceEntity extends Model {
  @ApiProperty()
  @ForeignKey(() => ClientEntity)
  @Column({ type: DataType.INTEGER })
  declare client: number;

  @ApiProperty()
  @Column
  declare name: string;
  @ApiProperty()
  @Column
  declare period: string;
  @ApiProperty()
  @Column
  declare rate: number;
}
