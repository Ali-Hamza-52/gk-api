import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'profession_base', timestamps: false })
export class ProfessionEntity extends Model {
  @Column({ primaryKey: true })
  declare profession_en: string;

  @Column
  declare profession_ar: string;
}
