// src/work-orders/work-orders.module.ts

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WorkOrder } from './entities/work-orders.entity';
import { WorkOrderService } from './work-orders.service';
import { WorkOrdersController } from './work-orders.controller';
import { ClientEntity } from '@/sales/clients/client.entity';
import { ClientLocationEntity } from '@/sales/clients/client-location.entity';
import { User } from '@/users/user.entity';
import { PermissionsModule } from '@/permissions/permissions.module';
import { WorkOrderServicesModule } from './work-order-services/work-order-services.module';
import { WorkOrderAddonsModule } from './work-order-addons/work-order-addons.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      WorkOrder,
      ClientEntity,
      ClientLocationEntity,
      User,
    ]),
    PermissionsModule,
    WorkOrderServicesModule,
    WorkOrderAddonsModule, // Import existing work-order-services module
  ],
  providers: [WorkOrderService],
  controllers: [WorkOrdersController],
  exports: [WorkOrderService, SequelizeModule],
})
export class WorkOrdersModule {}
