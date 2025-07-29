import { Column, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'asset_types',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class AssetTypeEntity extends Model {
  @ApiProperty({ example: 1 })
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @ApiProperty({ example: 'Excavator' })
  @Column
  declare title: string;

  @ApiProperty({ example: 1 })
  @Column
  declare created_by: number;

  @ApiProperty({ example: 2 })
  @Column
  declare updated_by: number;
}
