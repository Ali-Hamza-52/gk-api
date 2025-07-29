import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'nationalities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class NationalityEntity extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column
  declare name: string;
}
