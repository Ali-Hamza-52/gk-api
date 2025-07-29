import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'asset_makes', timestamps: false })
export class AssetMakeEntity extends Model {
  @Column
  declare title: string;
  @Column
  declare created_by: number;
  @Column
  declare updated_by: number;
  @Column
  declare created_at: Date;
  @Column
  declare updated_at: Date;
}
