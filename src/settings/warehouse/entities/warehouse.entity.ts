import { Table, Column, Model } from 'sequelize-typescript';

@Table({
  tableName: 'warehouses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class WarehouseEntity extends Model<WarehouseEntity> {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column declare name: string;
  @Column declare name_ar: string;
  @Column declare city: string;
  @Column declare address: string;
  @Column declare address_ar: string;
  @Column declare latitude: string;
  @Column declare longitude: string;
  @Column declare created_by: number;
  @Column declare updated_by: number;
  @Column declare created_at: Date;
  @Column declare updated_at: Date;
}
