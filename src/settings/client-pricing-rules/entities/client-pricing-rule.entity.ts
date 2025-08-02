// src/client-pricing-rules/entities/client-pricing-rule.entity.ts

import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ClientEntity } from '@/sales/clients/client.entity';

export enum ServiceCategory {
  HVAC = 'HVAC',
  PLUMBING = 'Plumbing',
  ELECTRICAL = 'Electrical',
  ELECTRONICS = 'Electronics',
  CLEANING = 'Cleaning',
  PEST_CONTROL = 'Pest Control',
  LANDSCAPING = 'Landscaping',
  CIVIL = 'Civil',
}

export enum PricingType {
  DISCOUNT = 'discount',
  MARKUP = 'markup',
}

export enum AppliesTo {
  SERVICE = 'service',
  ADDON = 'addon',
  MATERIAL = 'material',
}

@Table({ tableName: 'client_pricing_rules', timestamps: false })
export class ClientPricingRule extends Model<ClientPricingRule> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  declare id: number;

  @ForeignKey(() => ClientEntity)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'client_code',
  })
  declare client_code: number;

  @Column({
    type: DataType.ENUM(...Object.values(ServiceCategory)),
    allowNull: false,
  })
  declare category: ServiceCategory;

  @Column({
    type: DataType.ENUM(...Object.values(PricingType)),
    allowNull: false,
    field: 'pricing_type',
  })
  declare pricingType: PricingType;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    field: 'percentage_value',
  })
  declare percentageValue: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    field: 'applies_to',
  })
  declare appliesTo: AppliesTo[];

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

  @BelongsTo(() => ClientEntity, 'client_code')
  declare client: ClientEntity;
}
