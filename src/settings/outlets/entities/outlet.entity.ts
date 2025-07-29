import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'outlets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class OutletEntity extends Model<OutletEntity> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column
  declare name: string;

  @Column
  declare name_ar: string;

  @Column
  declare city: string;

  @Column
  declare address: string;

  @Column
  declare address_ar: string;

  @Column
  declare latitude: string;

  @Column
  declare longitude: string;

  @Column
  declare created_by: number;

  @Column
  declare updated_by: number;
}
