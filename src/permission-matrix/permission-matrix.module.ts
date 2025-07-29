import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PermissionMatrixService } from './permission-matrix.service';
import { PermissionMatrixController } from './permission-matrix.controller';
import { UserLevel } from '../permissions/user-level.entity';
import { User } from '../users/user.entity';
import { PermissionResource } from '../permissions/entities/permission-resource.entity';
import { PermissionAction } from '../permissions/entities/permission-action.entity';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserLevel,
      User,
      PermissionResource,
      PermissionAction,
    ]),
    PermissionsModule,
  ],
  controllers: [PermissionMatrixController],
  providers: [PermissionMatrixService],
  exports: [PermissionMatrixService],
})
export class PermissionMatrixModule {}
