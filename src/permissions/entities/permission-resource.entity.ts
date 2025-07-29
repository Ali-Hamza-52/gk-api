import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { PermissionRole } from './permission-role.entity';

@Table({ tableName: 'permissions_resources', timestamps: true, underscored: true })
export class PermissionResource extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(50), unique: true })
  declare name: string;

  @Column({ type: DataType.STRING(100) })
  declare display_name: string;

  @Column({ type: DataType.TEXT })
  declare description: string;

  @Column({ type: DataType.STRING(50) })
  declare module_group: string;

  @HasMany(() => PermissionRole, { foreignKey: 'resource_id', as: 'permissionRoles' })
  permissionRoles: PermissionRole[];
}
