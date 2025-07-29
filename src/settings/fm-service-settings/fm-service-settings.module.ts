import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FmServiceSettingsService } from './fm-service-settings.service';
import { FmServiceSettingsController } from './fm-service-settings.controller';
import { FmServiceSettings } from './fm-service-settings.entity';

@Module({
  imports: [SequelizeModule.forFeature([FmServiceSettings])],
  controllers: [FmServiceSettingsController],
  providers: [FmServiceSettingsService],
  exports: [FmServiceSettingsService],
})
export class FmServiceSettingsModule {}
