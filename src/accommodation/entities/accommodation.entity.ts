// src/accommodation/entities/accommodation.entity.ts

import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { AccommodationPayment } from '@/accommodation-payment/entities/accommodation-payment.entity';
import { AccommodationBillPayment } from '@/accommodation-bill-payment/entities/accommodation-bill-payment.entity';

@Table({ tableName: 'accommodation_base', timestamps: false })
export class Accommodation extends Model<Accommodation> {
  @PrimaryKey
  @Column
  declare id: number;

  @Column
  declare name: string;

  @Column
  declare location: string;

  @Column
  declare city: string;

  @Column
  declare address: string;

  @Column
  declare rooms: number;

  @Column
  declare beds: number;

  @Column
  declare contract_startdate: string;

  @Column
  declare contract_enddate: string;

  @Column
  declare rent: number;

  @Column
  declare services: string;

  @Column({ field: 'due-date' })
  declare dueDate: string;

  @Column
  declare period: string;

  @Column
  declare apartment: string;

  @Column
  declare electricityAccountNo: string;

  @Column
  declare waterBillAccountNo: string;

  @Column
  declare contactName: string;

  @Column
  declare contactNo: string;

  @Column
  declare accountName: string;

  @Column
  declare bankName: string;

  @Column
  declare iban: string;

  @Column
  declare fixedElectricityAmount: number;

  @Column
  declare fixedWaterAmount: number;

  @Column(DataType.JSON)
  declare contract_attachment: string[];

  @Column
  declare contract_type: string;

  @Column
  declare rent_payment_method: string;

  @Column
  declare salary: number;

  @Column
  declare employee_id: number;

  @Column
  declare accommodation_status: string;

  @Column
  declare contract_number: string;

  @Column
  declare notes: string;

  @Column
  declare lat: string;

  @Column
  declare lng: string;

  @Column
  declare created_by: number;

  @Column
  declare updated_by: number;

  @HasMany(() => AccommodationPayment)
  declare payments: AccommodationPayment[];

  @HasMany(() => AccommodationBillPayment)
  declare billPayments: AccommodationBillPayment[];
}
