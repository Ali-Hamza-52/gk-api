// src/work-orders/work-order-parts/entities/work-order-part.entity.ts

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
import { WorkOrderService } from '@/work-orders/work-order-services/entities/work-order-service.entity';
import { MaterialEntity } from '@/settings/materials/entities/material.entity';
import { SupplierEntity } from '@/purchasing/suppliers/entities/supplier.entity';
import { User } from '@/users/user.entity';

@Table({
  tableName: 'work_order_parts',
  timestamps: true,
  indexes: [
    {
      fields: ['work_order_id'],
    },
    {
      fields: ['work_order_service_id'],
    },
    {
      fields: ['part_id'],
    },
    {
      fields: ['supplier_id'],
    },
    {
      fields: ['approved_by_client'],
    },
  ],
})
export class WorkOrderPart extends Model<WorkOrderPart> {
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

  @ForeignKey(() => WorkOrderService)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'work_order_service_id',
    comment: 'Reference to work_order_services table',
  })
  declare work_order_service_id: number;

  @ForeignKey(() => MaterialEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'part_id',
    comment: 'Reference to materials table',
  })
  declare part_id: number;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'quantity',
    comment: 'Number of units used',
    validate: {
      min: 1,
      isInt: true,
    },
  })
  declare quantity: number;

  @Column({
    type: DataType.FLOAT(10, 2),
    allowNull: false,
    field: 'unit_price',
    comment: 'Unit price excluding VAT',
    validate: {
      min: 0,
    },
  })
  declare unit_price: number;

  @Column({
    type: DataType.FLOAT(10, 2),
    allowNull: true,
    field: 'total_price',
    comment: 'Calculated as quantity * unit_price',
  })
  declare total_price: number;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'warranty_duration',
    defaultValue: 0,
    comment: 'Warranty duration in days',
  })
  declare warranty_duration: number;

  @ForeignKey(() => SupplierEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'supplier_id',
    comment: 'Reference to suppliers table',
  })
  declare supplier_id: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'approved_by_client',
    comment: 'Client approval status, defaults to false',
  })
  declare approved_by_client: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'approved_by_userid',
    comment: 'User who approved the part',
  })
  declare approved_by_userid: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'approved_date',
    comment: 'Timestamp when part was approved',
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

  @BelongsTo(() => WorkOrderService, {
    foreignKey: 'work_order_service_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare workOrderService: WorkOrderService;

  @BelongsTo(() => MaterialEntity, {
    foreignKey: 'part_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  declare material: MaterialEntity;

  @BelongsTo(() => SupplierEntity, {
    foreignKey: 'supplier_id',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare supplier: SupplierEntity;

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
