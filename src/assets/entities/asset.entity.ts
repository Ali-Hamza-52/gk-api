import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { VendorEntity } from '@/purchasing/vendors/vendor.entity';
import { AssetTypeEntity } from '@/settings/asset-type/entities/asset-type.entity';
import { AssetMakeEntity } from '@/settings/asset-make/entities/asset-make.entity';
import { AssetCapacityEntity } from '@/settings/asset-capacity/entities/asset-capacity.entity';
@Table({ tableName: 'assets_managments', timestamps: false })
export class AssetEntity extends Model<AssetEntity> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare id: number;

  @ForeignKey(() => VendorEntity)
  @Column({ field: 'vendor_id', type: DataType.INTEGER })
  declare vendor_id: number;

  // THIS is your one-and-only vendor belong-to
  @BelongsTo(() => VendorEntity, 'vendor_id')
  declare vendor: VendorEntity;

  @Column({ field: 'asset_name' })
  declare asset_name: string;

  @Column
  declare serial: string;

  @ForeignKey(() => AssetTypeEntity)
  @Column({ field: 'asset_type_id', type: DataType.INTEGER })
  declare asset_type_id: number;
  @BelongsTo(() => AssetTypeEntity, 'asset_type_id')
  declare assetType: AssetTypeEntity;

  @ForeignKey(() => AssetMakeEntity)
  @Column({ field: 'asset_make_id', type: DataType.INTEGER })
  declare asset_make_id: number;
  @BelongsTo(() => AssetMakeEntity, 'asset_make_id')
  declare assetMake: AssetMakeEntity;

  @ForeignKey(() => AssetCapacityEntity)
  @Column({ field: 'asset_capacity_id', type: DataType.INTEGER })
  declare asset_capacity_id: number;
  @BelongsTo(() => AssetCapacityEntity, 'asset_capacity_id')
  declare assetCapacity: AssetCapacityEntity;

  // Now define your snake‐case columns
  @Column({ field: 'asset_model' })
  declare asset_model: string;

  @Column
  declare year: number;

  @Column({ field: 'fuel_type' })
  declare fuel_type: string;

  @Column({ field: 'purchase_date', type: DataType.DATE })
  declare purchase_date: Date;

  @Column({ field: 'purchase_price_excl_vat' })
  declare purchase_price_excl_vat: number;

  @Column({ field: 'warranty_expiry_date', type: DataType.DATE })
  declare warranty_expiry_date: Date;

  @Column({ field: 'useful_life' })
  declare useful_life: number;

  @Column
  declare usages: string;

  @Column({ field: 'warranty_documents' })
  declare warranty_documents: string;

  @Column({ field: 'invoice_documents' })
  declare invoice_documents: string;

  @Column({ field: 'front_image' })
  declare front_image: string;

  @Column({ field: 'back_image' })
  declare back_image: string;

  @Column({ field: 'right_image' })
  declare right_image: string;

  @Column({ field: 'left_image' })
  declare left_image: string;

  @Column
  declare location: string;

  @Column({ field: 'current_location' })
  declare current_location: string;

  @Column
  declare notes: string;

  @Column({ field: 'odo_meter_reading' })
  declare odo_meter_reading: number;

  @Column
  declare status: string;

  @Column
  declare category: number;

  @Column
  declare lat: number;

  @Column
  declare lng: number;

  @Column({ field: 'created_by' })
  declare created_by: number;

  @Column({ field: 'updated_by' })
  declare updated_by: number;
}
