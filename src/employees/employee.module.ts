import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Employee } from './entities/employee.entity';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { CommonModule } from '@/common/common.module';
import { VendorEntity } from '@/purchasing/vendors/vendor.entity';
import { ClientEntity } from '@/sales/clients/client.entity';
import { Accommodation } from '@/accommodation/entities/accommodation.entity';
import { PermissionsModule } from '@/permissions/permissions.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Employee,
      VendorEntity,
      ClientEntity,
      Accommodation,
    ]),
    CommonModule,
    PermissionsModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
