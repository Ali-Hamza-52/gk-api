import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PermissionService } from './permission.service';
import { NormalizedPermissionService } from './normalized-permission.service';
import { SettingsConsolidationService } from './settings-consolidation.service';
import { PermissionController } from './permission.controller';
import { UserLevel } from './user-level.entity';
import { PermissionResource } from './entities/permission-resource.entity';
import { PermissionAction } from './entities/permission-action.entity';
import { PermissionRole } from './entities/permission-role.entity';
import { User } from '@/users/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserLevel,
      User,
      PermissionResource,
      PermissionAction,
      PermissionRole,
    ]),
  ],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    NormalizedPermissionService,
    SettingsConsolidationService,
  ],
  exports: [
    PermissionService,
    NormalizedPermissionService,
    SettingsConsolidationService,
  ],
})
export class PermissionsModule {}
