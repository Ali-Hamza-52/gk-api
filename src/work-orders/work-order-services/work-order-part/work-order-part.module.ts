// src/work-orders/work-order-parts/work-order-parts.module.ts

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WorkOrderPart } from './entities/work-order-part.entity';
import { WorkOrder } from '@/work-orders/entities/work-orders.entity';
import { WorkOrderService } from '@/work-orders/work-order-services/entities/work-order-service.entity';
import { MaterialEntity } from '@/settings/materials/entities/material.entity';
import { SupplierEntity } from '@/purchasing/suppliers/entities/supplier.entity';
import { User } from '@/users/user.entity';
import { WorkOrderPartsService } from './work-order-part.service';
import { WorkOrderPartsController } from './work-order-part.controller';
import { PermissionsModule } from '@/permissions/permissions.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      WorkOrderPart,
      WorkOrder,
      WorkOrderService,
      MaterialEntity,
      SupplierEntity,
      User,
    ]),
    PermissionsModule,
  ],
  providers: [WorkOrderPartsService],
  controllers: [WorkOrderPartsController],
  exports: [WorkOrderPartsService, SequelizeModule],
})
export class WorkOrderPartModule {}
