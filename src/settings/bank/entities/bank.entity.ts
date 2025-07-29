import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'banks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class BankEntity extends Model {
  @Column({ primaryKey: true, autoIncrement: false })
  declare id: bigint;

  @Column declare name_en: string;

  @Column declare name_ar: string;

  @Column declare full_name: string;
}
