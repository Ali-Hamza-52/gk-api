import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'units',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class UnitEntity extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column
  declare unit_code: string;

  @Column
  declare unit_name: string;

  @Column
  declare created_by: number;

  @Column
  declare updated_by: number;
}
