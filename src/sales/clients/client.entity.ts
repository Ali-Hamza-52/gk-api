import {
  Table,
  Column,
  Model,
  PrimaryKey,
  HasMany,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ClientServiceEntity } from './client-service.entity';
import { ClientLocationEntity } from './client-location.entity';
import { User } from '@/users/user.entity';

@Table({ tableName: 'client_base', timestamps: false })
export class ClientEntity extends Model {
  @ApiProperty()
  @PrimaryKey
  @Column({ type: DataType.INTEGER })
  declare client_code: number;

  @ApiProperty()
  @Column
  declare client_name: string;

  @ApiProperty()
  @Column
  declare client_name_ar?: string;

  @ApiProperty()
  @Column
  declare address?: string;

  @ApiProperty()
  @Column
  declare address_ar?: string;

  @ApiProperty()
  @Column
  declare cr_no?: number;

  @ApiProperty()
  @Column
  declare cr?: string;

  @ApiProperty()
  @Column
  declare vat_no?: number;

  @ApiProperty()
  @Column
  declare vat_cert?: string;

  @ApiProperty()
  @Column
  declare ajeer_license?: string;

  @ApiProperty()
  @Column
  declare dept_en?: string;

  @ApiProperty()
  @Column
  declare dept_ar?: string;

  @ApiProperty()
  @Column
  declare contract?: string;

  @ApiProperty()
  @Column
  declare contract_type?: string;

  @ApiProperty()
  @Column
  declare contract_status?: string;

  @ApiProperty()
  @Column
  declare fat_details?: string;

  @ApiProperty()
  @Column
  declare rate1?: number;

  @ApiProperty()
  @Column
  declare rate2?: number;

  @ApiProperty()
  @Column
  declare overtime_rate1?: number;

  @ApiProperty()
  @Column
  declare overtime_rate2?: number;

  @ApiProperty()
  @Column
  declare start_date?: string;

  @ApiProperty()
  @Column
  declare end_date?: string;

  @ApiProperty()
  @Column
  declare daysWeek?: string;

  @ApiProperty()
  @Column
  declare hoursDay?: string;

  @ApiProperty()
  @Column
  declare account_name?: string;

  @ApiProperty()
  @Column
  declare bank_name?: string;

  @ApiProperty()
  @Column
  declare iban?: string;

  @ApiProperty({ type: [Number] })
  @Column({ type: DataType.JSON })
  declare sales_person?: number[];

  @ApiProperty()
  @Column
  declare StreetName?: string;

  @ApiProperty()
  @Column
  declare BuildingNumber?: string;

  @ApiProperty()
  @Column
  declare District?: string;

  @ApiProperty()
  @Column
  declare CityName?: string;

  @ApiProperty()
  @Column
  declare PostalZone?: string;

  @ApiProperty()
  @Column
  declare contactName?: string;

  @ApiProperty()
  @Column
  declare contactNo?: string;

  @ApiProperty()
  @Column
  declare contactEmail?: string;

  @ApiProperty()
  @Column
  declare billing_email?: string;

  @ApiProperty()
  @Column
  declare billing_phone?: string;

  @ApiProperty()
  @Column
  declare billing_name?: string;

  @ApiProperty()
  @Column
  declare hr_email?: string;

  @ApiProperty()
  @Column
  declare hr_phone?: string;

  @ApiProperty()
  @Column
  declare hr_name?: string;

  @HasMany(() => ClientServiceEntity, 'client')
  declare clientServices: ClientServiceEntity[];

  @HasMany(() => ClientLocationEntity, 'client_code')
  declare clientLocations: ClientLocationEntity[];

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  declare created_by?: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  declare updated_by?: number;

  @BelongsTo(() => User, 'created_by')
  declare createdByUser?: User;

  @BelongsTo(() => User, 'updated_by')
  declare updatedByUser?: User;
}
