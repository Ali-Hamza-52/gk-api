import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { PermissionRole } from './permission-role.entity';

@Table({ tableName: 'permissions_actions', timestamps: true, underscored: true, updatedAt: false })
export class PermissionAction extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(10), unique: true })
  declare name: string;

  @Column({ type: DataType.STRING(50) })
  declare display_name: string;

  @Column({ type: DataType.TEXT })
  declare description: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare requires_ownership: boolean;

  @HasMany(() => PermissionRole, { foreignKey: 'action_id', as: 'permissionRoles' })
  permissionRoles: PermissionRole[];
}
