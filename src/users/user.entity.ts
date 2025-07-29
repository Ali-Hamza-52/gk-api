import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { CreationOptional } from 'sequelize';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: CreationOptional<number>;

  @Column
  declare name: string;

  @Column
  declare email: string;

  @Column
  declare password: string;

  @Column
  declare pin: number;

  @Column
  declare isPinLocked: boolean;

  @Column
  declare userlevel: string;

  @Column
  declare activated: string;

  @Column
  declare user_name: string;


  @Column
  declare mobile: string;

  @Column
  declare status: string;

  @Column
  declare employee_id: number;

  @Column
  declare fcm_token: string;
}
