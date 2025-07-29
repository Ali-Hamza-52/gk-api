// src/accommodation-payment/entities/accommodation-payment.entity.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  DataType,
} from 'sequelize-typescript';
import { Accommodation } from '@/accommodation/entities/accommodation.entity';

@Table({ tableName: 'accommodation_payments', timestamps: false })
export class AccommodationPayment extends Model<AccommodationPayment> {
  @PrimaryKey
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
  declare notes: string;

  @Column
  declare periodFrom: string;

  @Column
  declare periodTo: string;

  @Column
  declare attachment: string;

  @Column
  declare rent_reciept: string;

  @Column
  declare rent_payment_method: string;

  @Column
  declare salary: number;

  @Column
  declare employee_id: number;

  @Column({ allowNull: true })
  declare created_by?: number;

  @Column({ allowNull: true, type: DataType.INTEGER })
  declare updated_by: number | null;

  @BelongsTo(() => Accommodation)
  declare accommodations: Accommodation;
}
