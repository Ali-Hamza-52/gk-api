import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'cities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CityEntity extends Model {
  @Column({ primaryKey: true, autoIncrement: false })
  declare id: bigint;

  @Column
  declare name: string;

  @Column
  declare name_ar: string;
}
