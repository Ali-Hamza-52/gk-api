import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { SupplierItemEntity } from './supplier-item.entity';

@Table({
  tableName: 'suppliers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class SupplierEntity extends Model {
  @Column
  declare name: string;
  @Column
  declare name_ar: string;
  @Column
  declare vat_number: string;
  @Column
  declare cr_number: string;
  @Column
  declare contact_name: string;
  @Column
  declare contact_number: string;
  @Column
  declare city: string;
  @Column
  declare bank_name: string;
  @Column
  declare account_name: string;
  @Column
  declare iban: string;
  @Column
  declare created_by: number;
  @Column
  declare updated_by: number;

  @HasMany(() => SupplierItemEntity, 'supplierId')
  declare supplierItems: SupplierItemEntity[];
}
