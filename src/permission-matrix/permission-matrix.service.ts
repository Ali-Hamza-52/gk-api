import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserLevel } from '../permissions/user-level.entity';
import { User } from '../users/user.entity';
import { PermissionResource } from '../permissions/entities/permission-resource.entity';
import { PermissionAction } from '../permissions/entities/permission-action.entity';
import { PermissionService } from '../permissions/permission.service';
import { UpdatePermissionMatrixDto } from './dto/permission-matrix.dto';
import { successResponse } from '../common/utils/response';

@Injectable()
export class PermissionMatrixService {
  constructor(
    @InjectModel(UserLevel)
    private readonly userLevelModel: typeof UserLevel,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(PermissionResource)
    private readonly permissionResourceModel: typeof PermissionResource,
    @InjectModel(PermissionAction)
    private readonly permissionActionModel: typeof PermissionAction,
    private readonly permissionService: PermissionService,
  ) {}

  async getPermissionMatrix(roleId: number) {
    const role = await this.userLevelModel.findByPk(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permissions =
      await this.permissionService.getFullPermissionsByRole(roleId);

    return successResponse('Permission matrix fetched successfully', {
      role: { id: role.id, name: role.name },
      permissions: permissions,
    });
  }

  async updatePermissionMatrix(
    roleId: number,
    dto: UpdatePermissionMatrixDto,
    userId: number,
  ) {
    const role = await this.userLevelModel.findByPk(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.permissionService.updateRolePermissions(
      roleId,
      dto.permissions,
      userId,
    );

    return successResponse('Permission matrix updated successfully', {
      role: { id: role.id, name: role.name },
      permissions: dto.permissions,
    });
  }

  async checkUserPermission(userId: number, module: string) {
    try {
      const user = await this.userModel.findByPk(userId, {
        attributes: ['userlevel'],
      });

      if (!user || !user.userlevel) {
        throw new NotFoundException('User or user role not found');
      }

      const modulePermissions =
        await this.permissionService.getModuleActionsByRole(
          parseInt(user.userlevel),
          module,
        );

      return successResponse('User permissions retrieved successfully', {
        userId,
        module,
        permissions: modulePermissions.action || '',
        formattedPermissions: this.formatPermissions(
          modulePermissions.action || '',
        ),
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Permission check failed: ' + error.message,
      );
    }
  }

  private formatPermissions(permissionString: string): string[] {
    return permissionString
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }

  async getAvailableModules() {
    const moduleFields = await this.permissionService.getAvailableModules();

    const modules = moduleFields.map((field) => ({
      key: field,
      name: this.formatModuleName(field),
      group: this.getModuleGroup(field),
    }));

    return successResponse('Available modules fetched successfully', modules);
  }

  async getModulesGrouped() {
    const modules = await this.getAvailableModules();
    const grouped = modules.data.reduce((acc: any, module: any) => {
      if (!acc[module.group]) {
        acc[module.group] = [];
      }
      acc[module.group].push(module);
      return acc;
    }, {});

    return successResponse('Grouped modules fetched successfully', grouped);
  }

  private formatModuleName(field: string): string {
    return field
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getModuleGroup(field: string): string {
    const groupMappings: Record<string, string> = {
      employees: 'HR',
      service_provider: 'HR',
      internal_employee: 'HR',
      leaves_requests: 'HR',
      employee_insurances: 'HR',
      warning_letters: 'HR',
      client: 'Sales',
      invoice: 'Sales',
      quotation: 'Sales',
      leads: 'Sales',
      sales_orders: 'Sales',
      vendor: 'Purchasing',
      supplier: 'Purchasing',
      purchase_order: 'Purchasing',
      materials: 'Inventory',
      products: 'Inventory',
      warehouses: 'Inventory',
      stocks: 'Inventory',
      accommodation: 'Accommodation',
      rent_payment: 'Accommodation',
      bill_payment: 'Accommodation',
      assets_managments: 'Assets',
      asset_work_orders: 'Assets',
      asset_maintenances: 'Assets',
      wallets: 'Finance',
      petty_cash: 'Finance',
      bank_account: 'Finance',
      expense_accounts: 'Finance',
      user_level: 'Settings',
      user: 'Settings',
      globalSetting: 'Settings',
      business_setting: 'Settings',
    };

    return groupMappings[field] || 'Other';
  }

  async getModulesList() {
    try {
      const resources = await this.permissionResourceModel.findAll({
        attributes: [
          'id',
          'name',
          'display_name',
          'description',
          'module_group',
        ],
        order: [
          ['module_group', 'ASC'],
          ['name', 'ASC'],
        ],
      });

      return successResponse('Modules list fetched successfully', resources);
    } catch (error) {
      throw error;
    }
  }

  async getActionsList() {
    try {
      const actions = await this.permissionActionModel.findAll({
        attributes: [
          'id',
          'name',
          'display_name',
          'description',
          'requires_ownership',
        ],
        order: [['id', 'ASC']],
      });

      return successResponse('Actions list fetched successfully', actions);
    } catch (error) {
      throw error;
    }
  }
}
