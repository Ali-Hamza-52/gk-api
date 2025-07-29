import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UserLevel } from './user-level.entity';
import { successResponse } from '../common/utils/response';
import { User } from '../users/user.entity';
import { NormalizedPermissionService } from './normalized-permission.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(UserLevel)
    private readonly userLevelModel: typeof UserLevel,

    @InjectModel(User)
    private readonly userModel: typeof User,

    private readonly normalizedService: NormalizedPermissionService,
  ) {}

  async create(dto: CreatePermissionDto, userId: number = 0) {
    const { name, ...permissions } = dto;

    const userLevel = await this.userLevelModel.create({
      name,
      created_by: userId,
      created_at: new Date(),
    });

    await this.normalizedService.updateRolePermissions(
      userLevel.id,
      permissions,
      userId,
    );

    return successResponse('Permission created successfully', {
      id: userLevel.id,
      name,
      ...permissions,
    });
  }

  async findAll() {
    const userLevels = await this.userLevelModel.findAll({
      attributes: ['id', 'name'],
    });

    const all = await Promise.all(
      userLevels.map(async (userLevel) => {
        const permissions =
          await this.normalizedService.getCompatibilityFormatPermissions(
            userLevel.id,
          );
        const number_of_users = await this.userModel.count({
          where: { userlevel: userLevel.id },
        });
        return {
          ...permissions,
          name: userLevel.name,
          number_of_users,
          userLevel: { id: userLevel.id, name: userLevel.name },
        };
      }),
    );

    return all;
  }

  async findOne(id: number) {
    const userLevel = await this.userLevelModel.findByPk(id);
    if (!userLevel) return null;

    const permissions =
      await this.normalizedService.getCompatibilityFormatPermissions(id);
    return {
      ...permissions,
      name: userLevel.name,
      userLevel: { id: userLevel.id, name: userLevel.name },
    };
  }

  async update(id: number, dto: UpdatePermissionDto, userId: number = 0) {
    const userLevel = await this.userLevelModel.findByPk(id);
    if (!userLevel) {
      throw new Error(`User level not found for ID ${id}`);
    }

    const { name, ...permissions } = dto;

    if (name) {
      await this.userLevelModel.update(
        { name, updated_by: userId, updated_at: new Date() },
        { where: { id } },
      );
    }

    await this.normalizedService.updateRolePermissions(id, permissions, userId);

    const updatedPermissions =
      await this.normalizedService.getCompatibilityFormatPermissions(id);
    return successResponse('Permission updated successfully', {
      ...updatedPermissions,
      name: name || userLevel.name,
    });
  }

  async remove(id: number) {
    const userLevel = await this.userLevelModel.findByPk(id);
    if (!userLevel) {
      throw new Error(`User level not found for ID ${id}`);
    }

    await this.normalizedService.updateRolePermissions(id, {}, 0);
    return this.userLevelModel.destroy({ where: { id } });
  }

  async getPermissionsByRole(
    role: string,
  ): Promise<{ action: string; module: string }[]> {
    console.log('[Permission Service] getPermissionsByRole called with:', {
      role,
      roleType: typeof role,
      convertedRole: +role,
      isNaN: isNaN(+role),
    });

    const roleId = Number(role);
    if (!role || role === 'undefined' || role === 'null' || isNaN(roleId)) {
      return [];
    }

    return this.normalizedService.getPermissionsByRole(roleId);
  }

  async getFullPermissionsByRole(role: number): Promise<any> {
    return this.normalizedService.getCompatibilityFormatPermissions(role);
  }

  async getModuleActionsByRole(
    roleId: number,
    moduleKey: string,
  ): Promise<{ module: string; action: string }> {
    return this.normalizedService.getModuleActionsByRole(roleId, moduleKey);
  }

  async hasViewAllPermission(roleId: number, module: string): Promise<boolean> {
    return this.normalizedService.hasViewAllPermission(roleId, module);
  }

  async hasViewOwnPermission(roleId: number, module: string): Promise<boolean> {
    return this.normalizedService.hasViewOwnPermission(roleId, module);
  }

  async hasAnyViewPermission(roleId: number, module: string): Promise<boolean> {
    return this.normalizedService.hasAnyViewPermission(roleId, module);
  }

  async hasEditOwnPermission(roleId: number, module: string): Promise<boolean> {
    return this.normalizedService.hasEditOwnPermission(roleId, module);
  }

  async hasDeleteOwnPermission(
    roleId: number,
    module: string,
  ): Promise<boolean> {
    return this.normalizedService.hasDeleteOwnPermission(roleId, module);
  }

  async hasEditAllPermission(roleId: number, module: string): Promise<boolean> {
    return this.normalizedService.hasEditAllPermission(roleId, module);
  }

  async hasDeleteAllPermission(
    roleId: number,
    module: string,
  ): Promise<boolean> {
    return this.normalizedService.hasDeleteAllPermission(roleId, module);
  }

  async hasAnyEditPermission(roleId: number, module: string): Promise<boolean> {
    return this.normalizedService.hasAnyEditPermission(roleId, module);
  }

  async hasAnyDeletePermission(
    roleId: number,
    module: string,
  ): Promise<boolean> {
    return this.normalizedService.hasAnyDeletePermission(roleId, module);
  }

  async hasCreatePermission(roleId: number, module: string): Promise<boolean> {
    return this.normalizedService.hasCreatePermission(roleId, module);
  }

  async updateRolePermissions(
    roleId: number,
    permissions: any,
    userId: number,
  ): Promise<void> {
    await this.normalizedService.updateRolePermissions(
      roleId,
      permissions,
      userId,
    );
  }

  async getAvailableModules(): Promise<string[]> {
    return this.normalizedService.getAvailableModules();
  }

  async getAllPermissionResources() {
    return this.normalizedService.getAllPermissionResources();
  }
}
