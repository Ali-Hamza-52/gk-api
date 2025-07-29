import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  DataType,
} from 'sequelize-typescript';
import { VendorServiceEntity } from './vendor-service.entity';

@Table({ tableName: 'vendor_base', timestamps: false })
export class VendorEntity extends Model<VendorEntity> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @Column
  declare code: string;

  @Column
  declare name: string;

  @Column({ allowNull: true })
  declare name_ar?: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  declare cr_no?: number;

  @Column({ allowNull: true })
  declare cr_file?: string;

  @Column({ allowNull: true, type: DataType.INTEGER })
  declare vat_no?: number;

  @Column({ allowNull: true })
  declare vat_file?: string;

  @Column({ allowNull: true })
  declare contract?: string;

  @Column({ allowNull: true })
  declare contact_ops?: string;

  @Column({ allowNull: true })
  declare contact_ops_no?: string;

  @Column({ allowNull: true })
  declare contact_billing?: string;

  @Column({ allowNull: true })
  declare contact_billing_no?: string;

  @Column({ allowNull: true })
  declare contact_gov?: string;

  @Column({ allowNull: true })
  declare contact_gov_no?: string;

  @Column({ type: DataType.BIGINT, allowNull: true })
  declare created_by?: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  declare updated_by?: number;

  @Column({ type: DataType.DATE, allowNull: true })
  declare created_at?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare updated_at?: Date;

  @HasMany(() => VendorServiceEntity, 'vendor')
  declare vendorServices: VendorServiceEntity[];
}
