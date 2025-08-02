import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { ClientEntity } from '@/sales/clients/client.entity';
import { ClientLocationEntity } from '@/sales/clients/client-location.entity';
import { User } from '@/users/user.entity';
import { WorkOrderService } from '@/work-orders/work-order-services/entities/work-order-service.entity';

export enum WorkOrderStatus {
  Requested = 'Requested',
  Diagnosed = 'Diagnosed',
  InProgress = 'In-Progress',
  Completed = 'Completed',
  Rejected = 'Rejected',
  Rework = 'Rework',
  Warranty = 'Warranty',
}

export enum WorkOrderPriority {
  Critical = 1,
  High = 2,
  Medium = 3,
  Low = 4,
  Routine = 5,
}

export enum RequestType {
  Open = 0,
  ServiceTask = 1,
}

@Table({ tableName: 'work_orders', timestamps: true })
export class WorkOrder extends Model<WorkOrder> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column({ allowNull: false, type: DataType.STRING(100) })
  declare work_order_code: string;

  @ForeignKey(() => ClientEntity)
  @Column({ allowNull: false })
  declare client_id: number;

  @ForeignKey(() => ClientLocationEntity)
  @Column({ allowNull: false })
  declare location_id: number;

  @Column({ allowNull: true })
  declare contract_id: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: RequestType.Open,
  })
  declare request_type: RequestType;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: WorkOrderPriority.Medium,
  })
  declare priority: WorkOrderPriority;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare contact_person: string;

  @Column({ type: DataType.STRING(50), allowNull: true })
  declare contact_number: string;

  @Column({ type: DataType.NUMBER, allowNull: false, defaultValue: 0 })
  declare work_order_value: number;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  declare requested_by: number;

  @Column({
    type: DataType.ENUM(...Object.values(WorkOrderStatus)),
    allowNull: true,
    defaultValue: WorkOrderStatus.Requested,
  })
  declare status: WorkOrderStatus;

  @ForeignKey(() => User)
  @Column({ allowNull: true })
  declare assigned_technician: number;

  @Column({ type: DataType.DATE, allowNull: true })
  declare diagnosis_timestamp: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare scheduled_timestamp: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  declare scheduled_date: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare sla_due_at: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare completed_at: Date;

  @Column({ type: DataType.TINYINT, allowNull: true })
  declare feedback_rating: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare feedback_comments: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false, allowNull: true })
  declare reopened_as_warranty: boolean;

  @ForeignKey(() => User)
  @Column({ allowNull: true })
  declare created_by: number;

  @ForeignKey(() => User)
  @Column({ allowNull: true })
  declare updated_by: number;

  // NEW FIELD: Notes (Only addition)
  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes: string;

  @CreatedAt
  @Column({ allowNull: true })
  declare created_at: Date;

  @UpdatedAt
  @Column({ allowNull: true })
  declare updated_at: Date;

  // Associations
  @BelongsTo(() => ClientEntity, 'client_id')
  declare client: ClientEntity;

  @BelongsTo(() => ClientLocationEntity, 'location_id')
  declare clientLocation: ClientLocationEntity;

  @BelongsTo(() => User, 'requested_by')
  declare requester: User;

  @BelongsTo(() => User, 'assigned_technician')
  declare technician: User;

  @BelongsTo(() => User, 'created_by')
  declare creator: User;

  @BelongsTo(() => User, 'updated_by')
  declare updater: User;

  // One-to-Many relationship with WorkOrderService (CASCADE DELETE)
  @HasMany(() => WorkOrderService, {
    foreignKey: 'work_order_id',
    onDelete: 'CASCADE',
  })
  declare workOrderServices: WorkOrderService[];
}
