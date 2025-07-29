import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { UserRoleAssignmentController } from './user-role-assignment.controller';
import { UserLevel } from '../permissions/user-level.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [SequelizeModule.forFeature([UserLevel, User])],
  controllers: [RoleController, UserRoleAssignmentController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RolesModule {}
