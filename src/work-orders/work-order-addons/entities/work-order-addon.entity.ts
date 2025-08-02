// src/work-orders/work-order-addons/entities/work-order-addon.entity.ts

import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { WorkOrder } from '@/work-orders/entities/work-orders.entity';
import { User } from '@/users/user.entity';

export enum AddonType {
  Platform = 'Platform',
  Crane = 'Crane',
  Transport = 'Transport',
  Custom = 'Custom',
}

@Table({
  tableName: 'work_order_addons',
  timestamps: true,
  indexes: [
    {
      fields: ['work_order_id'],
    },
    {
      fields: ['addon_type'],
    },
    {
      fields: ['approved_by_client'],
    },
    {
      fields: ['price'],
    },
  ],
})
export class WorkOrderAddon extends Model<WorkOrderAddon> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  declare id: number;

  @ForeignKey(() => WorkOrder)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'work_order_id',
    comment: 'Reference to work_orders table',
  })
  declare work_order_id: number;

  @Column({
    type: DataType.ENUM(...Object.values(AddonType)),
    allowNull: false,
    field: 'addon_type',
    comment: 'Type of addon: Platform, Crane, Transport, Custom',
  })
  declare addon_type: AddonType;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'description',
    comment: 'Description of the addon',
  })
  declare description: string;

  @Column({
    type: DataType.FLOAT(10, 2),
    allowNull: false,
    field: 'price',
    comment: 'Price excluding VAT',
    validate: {
      min: 0,
    },
  })
  declare price: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    field: 'approved_by_client',
    comment: 'Client approval status, defaults to false',
  })
  declare approved_by_client: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'approved_by_userid',
    comment: 'User who approved the addon',
  })
  declare approved_by_userid: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'approved_date',
    comment: 'Timestamp when addon was approved',
  })
  declare approved_date: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'created_by',
  })
  declare created_by: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'updated_by',
  })
  declare updated_by: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'created_at',
  })
  declare created_at: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'updated_at',
  })
  declare updated_at: Date;

  // Associations with CASCADE behavior
  @BelongsTo(() => WorkOrder, {
    foreignKey: 'work_order_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare workOrder: WorkOrder;

  @BelongsTo(() => User, {
    foreignKey: 'approved_by_userid',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare approvedByUser: User;

  @BelongsTo(() => User, {
    foreignKey: 'created_by',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare creator: User;

  @BelongsTo(() => User, {
    foreignKey: 'updated_by',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare updater: User;
}
