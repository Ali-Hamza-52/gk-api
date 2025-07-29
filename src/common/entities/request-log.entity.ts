// src/common/entities/request-log.entity.ts

import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

/**
 * These are exactly the fields you will pass into `.create()`.
 * You do *not* include `id` here, Sequelize will fill that.
 */
export interface RequestLogCreationAttrs {
  user_id: number;
  module: string;
  record_id: number;
  status: string;
  payload: string;
  url: string;
  method: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

@Table({ tableName: 'requests_logs', timestamps: false })
export class RequestLogEntity extends Model<
  RequestLogEntity,
  RequestLogCreationAttrs
> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER.UNSIGNED })
  declare id: number;

  @Column({ type: DataType.BIGINT })
  declare user_id: number;

  @Column(DataType.STRING)
  declare url: string;

  @Column(DataType.STRING)
  declare method: string;

  @Column(DataType.TEXT)
  declare payload: string;

  @Column(DataType.STRING)
  declare module: string;

  @Column({ type: DataType.BIGINT })
  declare record_id: number;

  @Column(DataType.STRING)
  declare status: string;

  @Column({ type: DataType.BIGINT })
  declare created_by: number;

  @Column({ type: DataType.DATE })
  declare created_at: Date;

  @Column({ type: DataType.DATE })
  declare updated_at: Date;
}
