import { Table, Model, Column, ForeignKey } from 'sequelize-typescript';
import { VendorEntity } from './vendor.entity';

@Table({
  tableName: 'vendor_services',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class VendorServiceEntity extends Model<VendorServiceEntity> {
  @ForeignKey(() => VendorEntity)
  @Column
  declare vendor: number;

  @Column
  declare name: string;

  @Column
  declare period: string;

  @Column
  declare rate: string;
}
