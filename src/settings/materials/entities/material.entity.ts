// src/settings/materials/entities/material.entity.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { MaterialCategoryEntity } from '../../material-categories/entities/material-category.entity';
import { UnitEntity } from '../../units/entities/unit.entity';

@Table({ tableName: 'materials', timestamps: false })
export class MaterialEntity extends Model<MaterialEntity> {
  @Column declare name: string;

  @ForeignKey(() => MaterialCategoryEntity)
  @Column
  declare category_id: number;
  @BelongsTo(() => MaterialCategoryEntity, 'category_id')
  declare category: MaterialCategoryEntity;

  @ForeignKey(() => UnitEntity)
  @Column
  declare purchase_unit_id: number;
  @BelongsTo(() => UnitEntity, 'purchase_unit_id')
  declare purchase_unit: UnitEntity;

  @ForeignKey(() => UnitEntity)
  @Column
  declare consumption_unit_id: number;
  @BelongsTo(() => UnitEntity, 'consumption_unit_id')
  declare consumption_unit: UnitEntity;

  @Column declare conversion_ratio: number;
  @Column declare re_order_qty: number;
  @Column declare stock_control: number;

  @Column declare created_by: number;
  @Column declare updated_by: number;
  @Column declare created_at: Date;
  @Column declare updated_at: Date;
}
