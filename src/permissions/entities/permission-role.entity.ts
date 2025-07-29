import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserLevel } from '../user-level.entity';
import { PermissionResource } from './permission-resource.entity';
import { PermissionAction } from './permission-action.entity';

@Table({ tableName: 'permissions_roles', timestamps: true, underscored: true })
export class PermissionRole extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => UserLevel)
  @Column({ type: DataType.INTEGER })
  declare role_id: number;

  @ForeignKey(() => PermissionResource)
  @Column({ type: DataType.INTEGER })
  declare resource_id: number;

  @ForeignKey(() => PermissionAction)
  @Column({ type: DataType.INTEGER })
  declare action_id: number;

  @Column({ type: DataType.JSON })
  declare conditions: any;

  @BelongsTo(() => UserLevel, { foreignKey: 'role_id', as: 'userLevel' })
  userLevel: UserLevel;

  @BelongsTo(() => PermissionResource, { foreignKey: 'resource_id', as: 'resource' })
  resource: PermissionResource;

  @BelongsTo(() => PermissionAction, { foreignKey: 'action_id', as: 'action' })
  action: PermissionAction;
}
