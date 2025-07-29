// src/assets/asset.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AssetEntity } from './entities/asset.entity';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { FileHelper } from '@/common/helpers/file.helper';
import { PermissionsModule } from '@/permissions/permissions.module';

@Module({
  imports: [SequelizeModule.forFeature([AssetEntity]), PermissionsModule],
  controllers: [AssetController],
  providers: [AssetService, FileHelper],
})
export class AssetModule {}
