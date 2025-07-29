import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'supplier_types', timestamps: false })
export class SupplierTypeEntity extends Model {
  @Column
  declare type: string;

  @Column({ type: DataType.BIGINT })
  declare created_by: number;

  @Column({ type: DataType.BIGINT })
  declare updated_by: number;

  @Column({ type: DataType.DATE })
  declare created_at: Date;

  @Column({ type: DataType.DATE })
  declare updated_at: Date;
}
