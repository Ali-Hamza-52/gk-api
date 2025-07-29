// src/settings/material-categories/entities/material-category.entity.ts
import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: 'material_categories', timestamps: false })
export class MaterialCategoryEntity extends Model<MaterialCategoryEntity> {
  @Column declare category_name: string;
  @Column declare description: string;
  @Column declare created_by: number;
  @Column declare updated_by: number;
  @Column declare created_at: Date;
  @Column declare updated_at: Date;
}
