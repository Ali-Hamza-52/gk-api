// src/suppliers/supplier.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SupplierEntity } from './entities/supplier.entity';
import { SupplierItemEntity } from './entities/supplier-item.entity';
import { SupplierTypeEntity } from './entities/supplier-type.entity';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SupplierEntity,
      SupplierItemEntity,
      SupplierTypeEntity,
    ]),
  ],
  providers: [SupplierService],
  controllers: [SupplierController],
})
export class SupplierModule {}
