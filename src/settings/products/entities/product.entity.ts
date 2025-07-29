import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { ProductCategoryEntity } from '../categories/entities/product-category.entity';
import { UnitEntity } from '../../units/entities/unit.entity';
import { OutletEntity } from '../../outlets/entities/outlet.entity';

@Table({
  tableName: 'product_service_lists',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductServiceEntity extends Model<ProductServiceEntity> {
  @Column declare name: string;
  @Column declare name_ar: string;
  @Column declare status: string;
  @Column declare type: string;
  @Column declare price: number;
  @Column declare product_variations: string;
  @Column declare thumbnail: string;
  @Column declare price_type: string;
  @Column declare barcode_type: string;
  @Column declare barcode: string;
  @Column declare sku: string;
  @Column declare pos_status: string;
  @Column declare stock_control: number;
  @Column declare inventory_unit: string;

  // Associations
  @ForeignKey(() => ProductCategoryEntity)
  @Column({ field: 'category_id', type: DataType.INTEGER })
  declare category_id: number;
  @BelongsTo(() => ProductCategoryEntity, 'category_id')
  declare category: ProductCategoryEntity;

  @ForeignKey(() => UnitEntity)
  @Column({ field: 'purchase_unit_id', type: DataType.INTEGER })
  declare purchase_unit_id: number;
  @BelongsTo(() => UnitEntity, 'purchase_unit_id')
  declare purchase_unit: UnitEntity;

  @ForeignKey(() => UnitEntity)
  @Column({ field: 'consumption_unit_id', type: DataType.INTEGER })
  declare consumption_unit_id: number;
  @BelongsTo(() => UnitEntity, 'consumption_unit_id')
  declare consumption_unit: UnitEntity;

  @ForeignKey(() => OutletEntity)
  @Column({ field: 'availability_in_outlets', type: DataType.INTEGER })
  declare availability_in_outlets: number;

  @BelongsTo(() => OutletEntity, 'availability_in_outlets')
  declare outlet: OutletEntity;
}
