import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerModule } from '@nestjs/throttler';
import { sequelizeConfig } from './database/sequelize.config';
import { RedisThrottlerStorageService } from './common/services/redis-throttler-storage.service';
import configuration from './config/configuration';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { PermissionMatrixModule } from './permission-matrix/permission-matrix.module';
import { VendorModule } from './purchasing/vendors/vendor.module';
import { ClientsModule } from './sales/clients/clients.module';
import { AccommodationModule } from './accommodation/accommodation.module';
import { AccommodationPaymentModule } from './accommodation-payment/accommodation-payment.module';
import { AccommodationBillPaymentModule } from './accommodation-bill-payment/accommodation-bill-payment.module';
import { FmServiceSettingsModule } from './settings/fm-service-settings/fm-service-settings.module';
import { EmployeeModule } from './employees/employee.module';
import { SupplierModule } from './purchasing/suppliers/supplier.module';
import { SettingsModule } from './settings/settings.module';
import { AssetModule } from './assets/asset.module';
import { WorkOrdersModule } from './work-orders/work-orders.module';
import { CommonModule } from './common/common.module';
import { FileController } from './common/controllers/file.controller';
import { config } from 'dotenv';
config(); // loads .env before app starts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: 60000, // 1 minute
            limit: 100, // 100 requests per minute per user (general API)
          },
        ],
        // storage: new RedisThrottlerStorageService(configService),
      }),
    }),
    SequelizeModule.forRoot(sequelizeConfig),
    CommonModule,
    AuthModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    PermissionMatrixModule,
    VendorModule,
    ClientsModule,
    AccommodationModule,
    AccommodationPaymentModule,
    AccommodationBillPaymentModule,
    FmServiceSettingsModule,
    EmployeeModule,
    SupplierModule,
    SettingsModule,
    AssetModule,
    WorkOrdersModule,
  ],
  controllers: [FileController],
})
export class AppModule {}
