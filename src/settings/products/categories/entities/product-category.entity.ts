// src/products/categories/entities/product-category.entity.ts
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'product_service_categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductCategoryEntity extends Model<ProductCategoryEntity> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.BIGINT })
  declare id: number;

  @Column({ allowNull: false })
  declare title: string;

  @Column({ allowNull: false })
  declare title_ar: string;

  @Column({ allowNull: true })
  declare icon: string;

  @Column({ allowNull: true })
  declare created_by: number;

  @Column({ allowNull: true })
  declare updated_by: number;
}
