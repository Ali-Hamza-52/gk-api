// src/assets/transformers/asset.transformer.ts
import { AssetEntity } from '../entities/asset.entity';
import { VendorEntity } from '@/purchasing/vendors/vendor.entity';
import { AssetTypeEntity } from '@/settings/asset-type/entities/asset-type.entity';
import { AssetMakeEntity } from '@/settings/asset-make/entities/asset-make.entity';
import { AssetCapacityEntity } from '@/settings/asset-capacity/entities/asset-capacity.entity';
import { FileHelper } from '@/common/helpers/file.helper';

export function transformAsset(
  a: AssetEntity & {
    vendor?: VendorEntity;
    assetType?: AssetTypeEntity;
    assetMake?: AssetMakeEntity;
    assetCapacity?: AssetCapacityEntity;
  },
  fileHelper: FileHelper,
) {
  return {
    id: a.id,
    status: a.status,
    vendor_id: a.vendor_id,
    vendor: a.vendor?.name || null,
    vendor_code: a.vendor?.code || null,
    category: a.category,
    asset_name: a.asset_name,
    serial: a.serial,
    asset_type: a.assetType?.title || null,
    make: a.assetMake?.title || null,
    asset_model: a.asset_model,
    year: a.year,
    capacity: a.assetCapacity?.title || null,
    fuel_type: a.fuel_type,
    purchase_date: a.purchase_date,
    purchase_price_excl_vat: a.purchase_price_excl_vat,
    warranty_expiry_date: a.warranty_expiry_date,
    useful_life: a.useful_life,
    usages: a.usages,
    warranty_documents: a.warranty_documents
      ? fileHelper.getFileUrl(a.warranty_documents)
      : null,
    invoice_documents: a.invoice_documents
      ? fileHelper.getFileUrl(a.invoice_documents)
      : null,
    front_image: a.front_image ? fileHelper.getFileUrl(a.front_image) : null,
    front_image_thumbnail: a.front_image
      ? fileHelper.getThumbnailUrl(a.front_image, 'small')
      : null,
    back_image: a.back_image ? fileHelper.getFileUrl(a.back_image) : null,
    back_image_thumbnail: a.back_image
      ? fileHelper.getThumbnailUrl(a.back_image, 'small')
      : null,
    right_image: a.right_image ? fileHelper.getFileUrl(a.right_image) : null,
    right_image_thumbnail: a.right_image
      ? fileHelper.getThumbnailUrl(a.right_image, 'small')
      : null,
    left_image: a.left_image ? fileHelper.getFileUrl(a.left_image) : null,
    left_image_thumbnail: a.left_image
      ? fileHelper.getThumbnailUrl(a.left_image, 'small')
      : null,
    current_location: a.current_location,
    notes: a.notes,
    odo_meter_reading: a.odo_meter_reading,
    // ignoring latest_end_date for now per your request
    // last_service_odometer: a.last_service_odometer || null,
    // last_service_odometer_date: a.last_service_odometer_date || null,
    location: a.location,
    lat: a.lat,
    lng: a.lng,
    created_by: a.created_by,
    updated_by: a.updated_by,
  };
}
