import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PermissionResource } from './entities/permission-resource.entity';
import { PermissionAction } from './entities/permission-action.entity';
import { PermissionRole } from './entities/permission-role.entity';

@Injectable()
export class NormalizedPermissionService {
  constructor(
    @InjectModel(PermissionResource)
    private readonly resourceModel: typeof PermissionResource,
    @InjectModel(PermissionAction)
    private readonly actionModel: typeof PermissionAction,
    @InjectModel(PermissionRole)
    private readonly roleModel: typeof PermissionRole,
  ) {}

  async getPermissionsByRole(
    roleId: number,
  ): Promise<{ action: string; module: string }[]> {
    try {
      if (!roleId || isNaN(roleId)) {
        return [];
      }
      const permissions = await this.roleModel.findAll({
        where: { role_id: roleId },
        include: [
          {
            model: this.resourceModel,
            as: 'resource',
            required: true,
            attributes: ['id', 'name', 'display_name'],
          },
          {
            model: this.actionModel,
            as: 'action',
            required: true,
            attributes: ['id', 'name', 'display_name'],
          },
        ],
        raw: false,
      });

      return permissions.map((p) => {
        const resource =
          p.resource || p.dataValues?.resource || p.get?.('resource');
        const action = p.action || p.dataValues?.action || p.get?.('action');

        const resourceName =
          resource?.name || resource?.dataValues?.name || 'UNKNOWN';
        const actionName =
          action?.name || action?.dataValues?.name || 'UNKNOWN';

        return {
          action: actionName,
          module: resourceName,
        };
      });
    } catch (error) {
      return [];
    }
  }

  async getCompatibilityFormatPermissions(roleId: number): Promise<any> {
    try {
      if (!roleId || isNaN(roleId)) {
        return {
          id: 1,
          userLevelId: roleId,
        };
      }

      const permissions = await this.getPermissionsByRole(roleId);
      const compatibilityFormat = {};

      permissions.forEach((p) => {
        if (!compatibilityFormat[p.module]) {
          compatibilityFormat[p.module] = [];
        }
        compatibilityFormat[p.module].push(p.action);
      });

      Object.keys(compatibilityFormat).forEach((key) => {
        compatibilityFormat[key] = [...new Set(compatibilityFormat[key])].join(
          ',',
        );
      });

      return {
        id: 1,
        userLevelId: roleId,
        ...compatibilityFormat,
      };
    } catch (error) {
      return {
        id: 1,
        userLevelId: roleId,
      };
    }
  }

  async getModuleActionsByRole(
    roleId: number,
    moduleKey: string,
  ): Promise<{ module: string; action: string }> {
    try {
      if (!roleId || isNaN(roleId)) {
        return { module: moduleKey, action: '' };
      }

      const permissions = await this.roleModel.findAll({
        where: { role_id: roleId },
        include: [
          {
            model: this.resourceModel,
            as: 'resource',
            where: { name: moduleKey },
          },
          { model: this.actionModel, as: 'action' },
        ],
      });

      if (!permissions.length) {
        return { module: moduleKey, action: '' };
      }

      const actions = permissions.map((p) => {
        const action = p.action || p.dataValues?.action || p.get?.('action');
        return action?.name || action?.dataValues?.name || 'UNKNOWN';
      });
      return {
        module: moduleKey,
        action: [...new Set(actions)].join(','),
      };
    } catch (error) {
      return { module: moduleKey, action: '' };
    }
  }

  async hasViewAllPermission(roleId: number, module: string): Promise<boolean> {
    if (!roleId || isNaN(roleId)) {
      return false;
    }
    const permissions = await this.getModuleActionsByRole(roleId, module);
    const actions = permissions.action.split(',').map((a) => a.trim());
    return actions.includes('V') && !actions.includes('VO');
  }

  async hasViewOwnPermission(roleId: number, module: string): Promise<boolean> {
    if (!roleId || isNaN(roleId)) {
      return false;
    }
    const permissions = await this.getModuleActionsByRole(roleId, module);
    const actions = permissions.action.split(',').map((a) => a.trim());
    return actions.includes('VO');
  }

  async hasAnyViewPermission(roleId: number, module: string): Promise<boolean> {
    if (!roleId || isNaN(roleId)) {
      return false;
    }
    const permissions = await this.getModuleActionsByRole(roleId, module);
    const actions = permissions.action.split(',').map((a) => a.trim());
    return actions.includes('V') || actions.includes('VO');
  }

  async hasEditOwnPermission(roleId: number, module: string): Promise<boolean> {
    if (!roleId || isNaN(roleId)) {
      return false;
    }
    const permissions = await this.getModuleActionsByRole(roleId, module);
    const actions = permissions.action.split(',').map((a) => a.trim());
    return actions.includes('EO');
  }

  async hasDeleteOwnPermission(
    roleId: number,
    module: string,
  ): Promise<boolean> {
    if (!roleId || isNaN(roleId)) {
      return false;
    }
    const permissions = await this.getModuleActionsByRole(roleId, module);
    const actions = permissions.action.split(',').map((a) => a.trim());
    return actions.includes('DO');
  }

  async hasEditAllPermission(roleId: number, module: string): Promise<boolean> {
    if (!roleId || isNaN(roleId)) {
      return false;
    }
    const permissions = await this.getModuleActionsByRole(roleId, module);
    const actions = permissions.action.split(',').map((a) => a.trim());
    return actions.includes('E') && !actions.includes('EO');
  }

  async hasDeleteAllPermission(
    roleId: number,
    module: string,
  ): Promise<boolean> {
    if (!roleId || isNaN(roleId)) {
      return false;
    }
    const permissions = await this.getModuleActionsByRole(roleId, module);
    const actions = permissions.action.split(',').map((a) => a.trim());
    return actions.includes('D') && !actions.includes('DO');
  }

  async hasAnyEditPermission(roleId: number, module: string): Promise<boolean> {
    if (!roleId || isNaN(roleId)) {
      return false;
    }
    const permissions = await this.getModuleActionsByRole(roleId, module);
    const actions = permissions.action.split(',').map((a) => a.trim());
    return actions.includes('E') || actions.includes('EO');
  }

  async hasAnyDeletePermission(
    roleId: number,
    module: string,
  ): Promise<boolean> {
    if (!roleId || isNaN(roleId)) {
      return false;
    }
    const permissions = await this.getModuleActionsByRole(roleId, module);
    const actions = permissions.action.split(',').map((a) => a.trim());
    return actions.includes('D') || actions.includes('DO');
  }

  async hasCreatePermission(roleId: number, module: string): Promise<boolean> {
    if (!roleId || isNaN(roleId)) {
      return false;
    }
    const permissions = await this.getModuleActionsByRole(roleId, module);
    const actions = permissions.action.split(',').map((a) => a.trim());
    return actions.includes('C');
  }

  async updateRolePermissions(
    roleId: number,
    permissions: any,
    userId: number,
  ): Promise<void> {
    if (!roleId || isNaN(roleId)) {
      throw new Error(`Invalid role ID: ${roleId}`);
    }

    await this.roleModel.destroy({
      where: { role_id: roleId },
    });

    const moduleFields = Object.keys(permissions);

    for (const module of moduleFields) {
      const actions = permissions[module];
      if (actions && actions.trim() !== '') {
        const resource = await this.resourceModel.findOne({
          where: { name: module },
        });

        if (!resource) {
          continue;
        }

        const actionList = actions
          .split(',')
          .map((a: string) => a.trim())
          .filter((a: string) => a);

        for (const actionName of actionList) {
          const action = await this.actionModel.findOne({
            where: { name: actionName },
          });

          if (!action) {
            continue;
          }

          await this.roleModel.create({
            role_id: roleId,
            resource_id: resource.id,
            action_id: action.id,
            created_by: userId,
            updated_by: userId,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }
    }
  }

  async getAvailableModules(): Promise<string[]> {
    const resources = await this.resourceModel.findAll({
      attributes: ['name'],
      group: ['name'],
    });

    return resources.map((r) => r.name);
  }

  async getAllPermissionResources(): Promise<PermissionResource[]> {
    const resources = await this.resourceModel.findAll({
      attributes: ['id', 'name', 'display_name', 'description', 'module_group'],
      order: [
        ['module_group', 'ASC'],
        ['name', 'ASC'],
      ],
    });

    return resources;
  }
}
