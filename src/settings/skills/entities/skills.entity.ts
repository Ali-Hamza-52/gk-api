import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'skills',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class SkillEntity extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column
  declare name_en: string;

  @Column
  declare name_ar: string;

  @Column
  declare created_at: Date;

  @Column
  declare updated_at: Date;
}
