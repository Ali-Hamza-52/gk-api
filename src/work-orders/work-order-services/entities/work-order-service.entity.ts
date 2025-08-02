// src/work-order-services/entities/work-order-service.entity.ts

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
} from 'sequelize-typescript';
import { WorkOrder } from '@/work-orders/entities/work-orders.entity';
import { FmServiceSettings } from '@/settings/fm-service-settings/fm-service-settings.entity';
import { User } from '@/users/user.entity';

export enum TaskStatus {
  REQUESTED = 'Requested',
  DIAGNOSED = 'Diagnosed',
  REJECTED = 'Rejected',
  IN_PROGRESS = 'In-Progress',
  COMPLETED = 'Completed',
  REWORK = 'Rework',
  WARRANTY = 'Warranty',
}

@Table({ tableName: 'work_order_services', timestamps: false })
export class WorkOrderService extends Model<WorkOrderService> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  declare id: number;

  @ForeignKey(() => WorkOrder)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'work_order_id',
  })
  declare work_order_id: number;

  @ForeignKey(() => FmServiceSettings)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'service_id_link',
  })
  declare service_id_link: number;

  @Default(TaskStatus.REQUESTED)
  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    allowNull: false,
    field: 'task_status',
  })
  declare task_status: TaskStatus;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'approved_by_client',
  })
  declare approved_by_client: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'approved_by_userid',
  })
  declare approved_by_userid: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'approved_date',
  })
  declare approved_date: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'created_by',
  })
  declare createdBy: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'updated_by',
  })
  declare updatedBy: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'created_at',
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'updated_at',
  })
  declare updatedAt: Date;

  // Associations
  @BelongsTo(() => WorkOrder, 'work_order_id')
  declare workOrder: WorkOrder;

  @BelongsTo(() => FmServiceSettings, 'service_id_link')
  declare service: FmServiceSettings;

  @BelongsTo(() => User, 'approved_by_userid')
  declare approvedByUser: User;
}
