import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { VendorEntity } from '@/purchasing/vendors/vendor.entity';
import { ClientEntity } from '@/sales/clients/client.entity';
import { Accommodation } from '@/accommodation/entities/accommodation.entity';

@Table({ tableName: 'employee_base', timestamps: false })
export class Employee extends Model<Employee> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare emp_id: number;

  @Column
  declare name: string;

  @Column
  declare nationality: string;

  @Column
  declare religion: string;

  @Column
  declare dob: Date;

  @Column
  declare joining_date: Date;

  @Column
  declare age: number;

  @Column
  declare contact_number: string;

  @Column
  declare emp_photo: string;

  @Column
  declare benefits: string;

  @Column
  declare iban: string;

  @Column
  declare vacation_date: Date;

  @Column
  declare notes: string;

  @Column
  declare iqama_no: number;

  @Column
  declare iqama_expiry_date: Date;

  @Column
  declare iqama_profession: string;

  @Column
  declare iqama: string;

  @Column
  declare passport_number: string;

  @Column
  declare passport_expiry_date: Date;

  @Column
  declare passport: string;

  @Column
  declare passport_2: string;

  @Column
  declare ajeer: string;

  @Column
  declare ajeer_expiration_date: Date;

  @Column
  declare insurance_card: string;

  @Column
  declare insurance_card_expirationDate: Date;

  @ForeignKey(() => VendorEntity)
  @Column
  declare vendor: number;

  @BelongsTo(() => VendorEntity, { foreignKey: 'vendor', as: 'vendors' })
  declare vendors: VendorEntity;

  @ForeignKey(() => ClientEntity)
  @Column
  declare client: string;

  @BelongsTo(() => ClientEntity, { foreignKey: 'client', as: 'clients' })
  declare clients: ClientEntity;

  @ForeignKey(() => Accommodation)
  @Column
  declare accommodation: number;

  @BelongsTo(() => Accommodation, {
    foreignKey: 'accommodation',
    as: 'accommodations',
  })
  declare accommodations: Accommodation;

  @Column
  declare salary_rate: string;

  @Column
  declare client_location: string;

  @Column
  declare staging_client: string;

  @Column
  declare status: string;

  @Column
  declare contract_start: Date;

  @Column
  declare project_stop_date: Date;

  @Column
  declare lang_eng: number;

  @Column
  declare lang_ar: number;

  @Column
  declare lang_hind: number;

  @Column
  declare appearance_presentable: number;

  @Column
  declare apprearance_beard: number;

  @Column
  declare skills: string;

  @Column
  declare misconduct: string;

  @Column
  declare rating: number;

  @Column
  declare created_by: string;

  @Column
  declare updated_by: string;

  @Column
  declare employee_type: string;

  @Column
  declare position: string;

  @Column
  declare contract_end: Date;

  @Column
  declare disconnection_date: Date;

  @Column
  declare disconnection_reason: string;

  @Column
  declare file_number: string;

  @Column
  declare bank_name: string;

  @Column
  declare vendor_rate: string;

  @Column
  declare monthly_other_allowance: string;

  @Column
  declare monthly_transportation_allowance: string;

  @Column
  declare monthly_housing_allowance: string;

  @Column
  declare employee_contract_start: Date;

  @Column
  declare total_leaves: number;
}
