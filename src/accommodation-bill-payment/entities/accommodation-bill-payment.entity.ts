// src/accommodation-bill-payment/entities/accommodation-bill-payment.entity.ts

import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  DataType,
  AutoIncrement,
} from 'sequelize-typescript';
import { Accommodation } from '@/accommodation/entities/accommodation.entity';

@Table({
  tableName: 'accommodation_bill_payments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class AccommodationBillPayment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @ForeignKey(() => Accommodation)
  @Column
  declare accommodation_base_id: number;

  @Column
  declare amount: number;

  @Column
  declare date: string;

  @Column
  declare billType: string;

  @Column
  declare billMonth: string;

  @Column({ allowNull: true })
  declare attachment?: string;

  @Column({ allowNull: true })
  declare notes?: string;

  @Column({ type: DataType.BIGINT, allowNull: true })
  declare created_by?: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  declare updated_by?: number;

  @BelongsTo(() => Accommodation, 'accommodation_base_id')
  declare accommodation: Accommodation;
}
