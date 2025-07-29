import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WorkOrderEntity } from './entities/work-orders.entity';
import { ClientEntity } from '@/sales/clients/client.entity';
import { ClientLocationEntity } from '@/sales/clients/client-location.entity';
import { User } from '@/users/user.entity';
import { WorkOrderService } from './work-orders.service';
import { WorkOrderController } from './work-orders.controller';
import { CommonModule } from '@/common/common.module';
import { PermissionsModule } from '@/permissions/permissions.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      WorkOrderEntity,
      ClientEntity,
      ClientLocationEntity,
      User,
    ]),
    CommonModule,
    PermissionsModule,
  ],
  controllers: [WorkOrderController],
  providers: [WorkOrderService],
  exports: [WorkOrderService],
})
export class WorkOrdersModule {}
