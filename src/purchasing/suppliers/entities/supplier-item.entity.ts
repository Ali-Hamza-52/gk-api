import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';
import { SupplierEntity } from './supplier.entity';
import { SupplierTypeEntity } from './supplier-type.entity';

@Table({ tableName: 'supplier_items', timestamps: false })
export class SupplierItemEntity extends Model {
  @ForeignKey(() => SupplierEntity)
  @Column
  declare supplierId: number;

  @ForeignKey(() => SupplierTypeEntity)
  @Column
  declare typeId: number;

  @BelongsTo(() => SupplierEntity)
  declare supplier: SupplierEntity;

  @HasOne(() => SupplierTypeEntity, 'id')
  declare supplierTypes: SupplierTypeEntity;
}
