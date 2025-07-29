// src/accommodation/accommodation.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Accommodation } from './entities/accommodation.entity';
import { AccommodationService } from './accommodation.service';
import { AccommodationController } from './accommodation.controller';
import { PermissionsModule } from '@/permissions/permissions.module';

@Module({
  imports: [SequelizeModule.forFeature([Accommodation]), PermissionsModule],
  providers: [AccommodationService],
  controllers: [AccommodationController],
})
export class AccommodationModule {}
