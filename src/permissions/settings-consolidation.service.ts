import { Injectable } from '@nestjs/common';
import { PermissionService } from './permission.service';

@Injectable()
export class SettingsConsolidationService {
  private readonly SETTINGS_CONSOLIDATION_MAP = {
    settings_inventory: [
      'products',
      'materials',
      'material_categories',
      'units',
      'warehouses',
      'outlets',
    ],
    settings_assets: [
      'asset_make',
      'asset_type',
      'asset_capacity',
      'assets_managments',
    ],
    settings_reference: [
      'cities',
      'nationality',
      'banks',
      'skills',
      'profession',
    ],
    settings_system: [
      'user_settings',
      'other_settings',
      'fm_service_settings',
      'business_setting',
      'finance_settings',
    ],
  };

  constructor(private readonly permissionService: PermissionService) {}

  async consolidateSettingsPermissions(
    roleId: number,
  ): Promise<Record<string, string>> {
    const consolidatedPermissions: Record<string, string> = {};

    for (const [consolidatedKey, modules] of Object.entries(
      this.SETTINGS_CONSOLIDATION_MAP,
    )) {
      const modulePermissions: string[] = [];

      for (const module of modules) {
        try {
          const permissions =
            await this.permissionService.getModuleActionsByRole(roleId, module);
          if (permissions.action) {
            const actions = permissions.action
              .split(',')
              .map((a) => a.trim())
              .filter((a) => a);
            modulePermissions.push(...actions);
          }
        } catch (error) {}
      }

      consolidatedPermissions[consolidatedKey] = [...new Set(modulePermissions)]
        .sort()
        .join(',');
    }

    return consolidatedPermissions;
  }

  getConsolidationMapping(): Record<string, string[]> {
    return { ...this.SETTINGS_CONSOLIDATION_MAP };
  }

  getConsolidatedPermissionForModule(moduleName: string): string | null {
    for (const [consolidatedKey, modules] of Object.entries(
      this.SETTINGS_CONSOLIDATION_MAP,
    )) {
      if (modules.includes(moduleName)) {
        return consolidatedKey;
      }
    }
    return null;
  }
}
