import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WorkOrderService } from './entities/work-order-service.entity';
import { WorkOrder } from '@/work-orders/entities/work-orders.entity';
import { FmServiceSettings } from '@/settings/fm-service-settings/fm-service-settings.entity';
import { User } from '@/users/user.entity';
import { WorkOrderServicesService } from './work-order-services.service';
import { WorkOrderServicesController } from './work-order-services.controller';
import { PermissionsModule } from '@/permissions/permissions.module';
import { WorkOrderPartModule } from './work-order-part/work-order-part.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      WorkOrderService,
      WorkOrder,
      FmServiceSettings,
      User,
    ]),
    PermissionsModule,
    WorkOrderPartModule,
  ],
  providers: [WorkOrderServicesService],
  controllers: [WorkOrderServicesController],
  exports: [WorkOrderServicesService],
})
export class WorkOrderServicesModule {}
