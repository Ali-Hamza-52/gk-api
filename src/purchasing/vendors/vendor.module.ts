import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { VendorEntity } from './vendor.entity';
import { VendorServiceEntity } from './vendor-service.entity';
import { PermissionsModule } from '@/permissions/permissions.module';

@Module({
  imports: [
    SequelizeModule.forFeature([VendorEntity, VendorServiceEntity]),
    PermissionsModule,
  ],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
