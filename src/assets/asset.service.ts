import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AssetEntity } from './entities/asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { FilterAssetDto } from './dto/filter-asset.dto';
import { Op } from 'sequelize';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { successResponse } from 'src/common/utils/response';
import { PermissionService } from '@/permissions/permission.service';
import { applyOwnershipFilter } from '@/common/utils/permission-filter';
import { UnifiedFileService } from 'src/common/services/unified-file.service';
import { FileHelper } from 'src/common/helpers/file.helper';
import { transformAsset } from './transformers/asset.transformer';
import { VendorEntity } from '@/purchasing/vendors/vendor.entity';
import { AssetTypeEntity } from '@/settings/asset-type/entities/asset-type.entity';
import { AssetMakeEntity } from '@/settings/asset-make/entities/asset-make.entity';
import { AssetCapacityEntity } from '@/settings/asset-capacity/entities/asset-capacity.entity';

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(AssetEntity) private readonly model: typeof AssetEntity,
    private readonly fileHelper: FileHelper,
    private readonly unifiedFileService: UnifiedFileService,
    private permissionService: PermissionService,
  ) {}

  private readonly uploadFields = [
    'warranty_documents',
    'invoice_documents',
    'front_image',
    'back_image',
    'right_image',
    'left_image',
  ];

  async create(
    dto: CreateAssetDto,
    files: Express.Multer.File[],
    userId: number,
  ) {
    (dto as any).created_by = userId;
    const asset = await this.model.create(dto as any);
    const assetId = asset.id;

    const filesByField = files.reduce(
      (acc, file) => {
        const fieldName = file.fieldname;
        if (!acc[fieldName]) acc[fieldName] = [];
        acc[fieldName].push(file);
        return acc;
      },
      {} as { [key: string]: Express.Multer.File[] },
    );

    const filePaths: any = {};
    for (const [fieldName, fieldFiles] of Object.entries(filesByField)) {
      if (this.uploadFields.includes(fieldName)) {
        const isImageField = [
          'front_image',
          'back_image',
          'left_image',
          'right_image',
        ].includes(fieldName);

        const results = await this.unifiedFileService.storeFiles(
          fieldFiles,
          'Assets',
          fieldName,
          assetId,
          {
            generateThumbnails: true,
            maxFileSize: isImageField ? 10485760 : 52428800,
            allowedMimeTypes: isImageField
              ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
              : undefined,
          },
        );

        if (results.length > 0) {
          filePaths[fieldName] = results[0].storedPath;
        }
      }
    }

    if (Object.keys(filePaths).length > 0) {
      await asset.update(filePaths);
    }

    const updatedAsset = await this.model.findByPk(assetId, {
      include: [
        { model: VendorEntity, as: 'vendor' },
        { model: AssetTypeEntity, as: 'assetType' },
        { model: AssetMakeEntity, as: 'assetMake' },
        { model: AssetCapacityEntity, as: 'assetCapacity' },
      ],
    });
    if (!updatedAsset) {
      throw new Error('Failed to retrieve created asset');
    }
    return successResponse(
      'Asset added successfully',
      transformAsset(updatedAsset, this.fileHelper),
    );
  }

  async findAll(filter: FilterAssetDto & { userId?: number; roleId?: number }) {
    const {
      page = 1,
      perPage = 15,
      searchTerm,
      year,
      status,
      vendor_id,
      asset_type_id,
      asset_make_id,
      asset_capacity_id,
      asset_model,
      fuel_type,
      purchase_date,
      purchase_price_excl_vat,
      warranty_expiry_date,
      useful_life,
      usages,
      location,
      current_location,
      notes,
      odo_meter_reading,
      category,
      lat,
      lng,
      userId,
      roleId,
    } = filter;

    let where: any = {};

    if (userId && roleId) {
      const hasViewAll = await this.permissionService.hasViewAllPermission(
        roleId,
        'assets_managments',
      );
      where = applyOwnershipFilter(where, {
        userId,
        roleId,
        module: 'assets_managments',
        hasViewAll,
      });
    }

    if (searchTerm) {
      const searchFilter = {
        [Op.or]: [
          { asset_name: { [Op.like]: `%${searchTerm}%` } },
          { serial: { [Op.like]: `%${searchTerm}%` } },
        ],
      };

      if (where[Op.and]) {
        (where[Op.and] as any[]).push(searchFilter);
      } else if (Object.keys(where).length > 0) {
        where = {
          [Op.and]: [where, searchFilter],
        };
      } else {
        where = searchFilter;
      }
    }

    const filters = {
      year,
      status,
      vendor_id,
      asset_type_id,
      asset_make_id,
      asset_capacity_id,
      asset_model,
      fuel_type,
      purchase_date,
      purchase_price_excl_vat,
      warranty_expiry_date,
      useful_life,
      odo_meter_reading,
      category,
      lat,
      lng,
    };

    const likeFilters = { usages, location, current_location, notes };

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        const filterCondition = { [key]: value };

        if (where[Op.and]) {
          (where[Op.and] as any[]).push(filterCondition);
        } else if (Object.keys(where).length > 0) {
          where = {
            [Op.and]: [where, filterCondition],
          };
        } else {
          where = filterCondition;
        }
      }
    }

    for (const [key, value] of Object.entries(likeFilters)) {
      if (value !== undefined && value !== null) {
        const filterCondition = { [key]: { [Op.like]: `%${value}%` } };

        if (where[Op.and]) {
          (where[Op.and] as any[]).push(filterCondition);
        } else if (Object.keys(where).length > 0) {
          where = {
            [Op.and]: [where, filterCondition],
          };
        } else {
          where = filterCondition;
        }
      }
    }

    const result = await paginateQuery(this.model, {
      where,
      include: [
        { model: VendorEntity, as: 'vendor' },
        { model: AssetTypeEntity, as: 'assetType' },
        { model: AssetMakeEntity, as: 'assetMake' },
        { model: AssetCapacityEntity, as: 'assetCapacity' },
      ],
      order: [['id', 'DESC']],
      page,
      perPage,
    });

    const transformedItems = result.items.map((a) =>
      transformAsset(a, this.fileHelper),
    );

    const transformedResult = {
      ...result,
      items: transformedItems,
    };

    return successResponse('Assets fetched.', transformedResult);
  }

  async findOne(id: number) {
    const asset = await this.model.findByPk(id, {
      include: [
        { model: VendorEntity, as: 'vendor' },
        { model: AssetTypeEntity, as: 'assetType' },
        { model: AssetMakeEntity, as: 'assetMake' },
        { model: AssetCapacityEntity, as: 'assetCapacity' },
      ],
    });
    if (!asset) throw new NotFoundException('Asset not found');
    return successResponse(
      'Asset fetched.',
      transformAsset(asset, this.fileHelper),
    );
  }

  async update(
    id: number,
    dto: UpdateAssetDto,
    files: Express.Multer.File[],
    userId: number,
  ) {
    const asset = await this.model.findByPk(id);
    if (!asset) throw new NotFoundException('Asset not found');

    const filesByField = files.reduce(
      (acc, file) => {
        const fieldName = file.fieldname;
        if (!acc[fieldName]) acc[fieldName] = [];
        acc[fieldName].push(file);
        return acc;
      },
      {} as { [key: string]: Express.Multer.File[] },
    );

    for (const [fieldName, fieldFiles] of Object.entries(filesByField)) {
      if (this.uploadFields.includes(fieldName)) {
        const isImageField = [
          'front_image',
          'back_image',
          'left_image',
          'right_image',
        ].includes(fieldName);

        const results = await this.unifiedFileService.storeFiles(
          fieldFiles,
          'Assets',
          fieldName,
          id,
          {
            generateThumbnails: true,
            maxFileSize: isImageField ? 10485760 : 52428800,
            allowedMimeTypes: isImageField
              ? ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
              : undefined,
          },
        );

        if (results.length > 0) {
          dto[fieldName] = results[0].storedPath;
        }
      }
    }

    (dto as any).updated_by = userId;
    const updated = await asset.update(dto as any);
    return successResponse(
      'Asset updated successfully',
      transformAsset(updated, this.fileHelper),
    );
  }

  async remove(id: number) {
    const asset = await this.model.findByPk(id);
    if (!asset) throw new NotFoundException('Asset not found');
    await asset.destroy();
    return successResponse('Asset deleted successfully');
  }

  async dropdown() {
    const list = await this.model.findAll({
      attributes: ['asset_name', 'id'],
      order: [['asset_name', 'ASC']],
    });

    const data = list.map((a) => ({ text: a.asset_name, id: a.id }));
    return successResponse('Assets dropdown fetched', data);
  }

  async summary() {
    const totalRows = await this.model.count();
    const activeAssets = await this.model.count({
      where: { status: 'Active' },
    });
    const underMaintenanceAssets = await this.model.count({
      where: { status: 'Under Maintenance' },
    });
    const inActiveAssets = await this.model.count({
      where: { status: 'In-Active' },
    });
    const damagedAssets = await this.model.count({
      where: { status: 'Damaged' },
    });

    return successResponse('Asset summary fetched successfully', {
      totalRows,
      activeAssets,
      underMaintenanceAssets,
      inActiveAssets,
      damagedAssets,
    });
  }
}
