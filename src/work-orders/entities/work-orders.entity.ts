import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ClientEntity } from '@/sales/clients/client.entity';
import { ClientLocationEntity } from '@/sales/clients/client-location.entity';
import { User } from '@/users/user.entity';

export enum WorkOrderStatus {
  REQUESTED = 'REQUESTED',
  DIAGNOSED = 'DIAGNOSED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REWORK = 'REWORK',
  WARRANTY = 'WARRANTY',
}

export enum WorkOrderPriority {
  CRITICAL = 1,
  HIGH = 2,
  MEDIUM = 3,
  LOW = 4,
  ROUTINE = 5,
}

@Table({ tableName: 'work_orders', timestamps: true })
export class WorkOrderEntity extends Model<WorkOrderEntity> {
  @ApiProperty({ example: 1, description: 'Auto-generated ID' })
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  declare id: number;

  @ApiProperty({ example: 'WO-2025-0001' })
  @Column({ type: DataType.STRING(100), allowNull: true })
  declare work_order_code?: string;

  @ApiProperty({ example: 1054 })
  @ForeignKey(() => ClientEntity)
  @Column(DataType.BIGINT)
  declare client_id: number;

  @BelongsTo(() => ClientEntity)
  declare client: ClientEntity;

  @ApiProperty({ example: 442 })
  @ForeignKey(() => ClientLocationEntity)
  @Column(DataType.BIGINT)
  declare location_id: number;

  @BelongsTo(() => ClientLocationEntity)
  declare location: ClientLocationEntity;

  @ApiProperty({ example: 0, description: '0 = Open, 1 = Service Task' })
  @Column(DataType.INTEGER)
  declare request_type: number;

  @ApiProperty({ example: 0, description: 'This is ForeignKey key' })
  @Column(DataType.INTEGER)
  declare contract_id: number;

  @ApiProperty({ enum: WorkOrderPriority })
  @Column(DataType.INTEGER)
  declare priority: WorkOrderPriority;

  @ApiProperty({ example: 'Salman Arif' })
  @Column(DataType.STRING(100))
  declare contact_person: string;

  @ApiProperty({ example: '+966501234567' })
  @Column(DataType.STRING(50))
  declare contact_number: string;

  @ApiProperty({ example: 15 })
  @ForeignKey(() => User)
  @Column(DataType.BIGINT)
  declare requested_by: number;

  @BelongsTo(() => User, 'requested_by')
  declare requester: User;

  @ApiProperty({ enum: WorkOrderStatus })
  @Column({
    type: DataType.ENUM(...Object.values(WorkOrderStatus)),
    defaultValue: WorkOrderStatus.REQUESTED,
  })
  declare status: WorkOrderStatus;

  @ApiProperty({ example: 25 })
  @ForeignKey(() => User)
  @Column({ type: DataType.BIGINT, allowNull: true })
  declare assigned_technician?: number;

  @BelongsTo(() => User, 'assigned_technician')
  declare technician?: User;

  @ApiProperty({ example: '2025-07-14T11:00:00Z' })
  @Column({ type: DataType.DATE, allowNull: true })
  declare diagnosis_timestamp?: Date;

  @ApiProperty({ example: '2025-07-14T17:00:00Z' })
  @Column(DataType.DATE)
  declare sla_due_at: Date;

  @ApiProperty({ example: '2025-07-14T15:00:00Z' })
  @Column({ type: DataType.DATE, allowNull: true })
  declare completed_at?: Date;

  @ApiProperty({ example: 4 })
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare feedback_rating?: number;

  @ApiProperty({ example: 'Technicians were responsive.' })
  @Column({ type: DataType.STRING, allowNull: true })
  declare feedback_comments?: string;

  @ApiProperty({ example: false })
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare reopened_as_warranty?: boolean;
}
