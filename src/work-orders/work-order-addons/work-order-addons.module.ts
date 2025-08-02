// src/work-orders/work-order-addons/work-order-addons.module.ts

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WorkOrderAddon } from './entities/work-order-addon.entity';
import { WorkOrder } from '@/work-orders/entities/work-orders.entity';
import { User } from '@/users/user.entity';
import { WorkOrderAddonsService } from './work-order-addons.service';
import { WorkOrderAddonsController } from './work-order-addons.controller';
import { PermissionsModule } from '@/permissions/permissions.module';

@Module({
  imports: [
    SequelizeModule.forFeature([WorkOrderAddon, WorkOrder, User]),
    PermissionsModule,
  ],
  providers: [WorkOrderAddonsService],
  controllers: [WorkOrderAddonsController],
  exports: [WorkOrderAddonsService, SequelizeModule],
})
export class WorkOrderAddonsModule {}
