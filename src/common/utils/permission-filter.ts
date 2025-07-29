import { WhereOptions, Op } from 'sequelize';

export interface PermissionFilterOptions {
  userId: number;
  roleId: number;
  module: string;
  hasViewAll: boolean;
}

export function applyOwnershipFilter<T>(
  where: WhereOptions<T>,
  options: PermissionFilterOptions,
): WhereOptions<T> {
  if (!options.hasViewAll) {
    const ownershipFilter = {
      [Op.or]: [{ created_by: options.userId }, { updated_by: options.userId }],
    };

    if (where[Op.and]) {
      (where[Op.and] as any[]).push(ownershipFilter);
    } else if (Object.keys(where).length > 0) {
      where = {
        [Op.and]: [where, ownershipFilter],
      } as WhereOptions<T>;
    } else {
      where = ownershipFilter as WhereOptions<T>;
    }
  }
  return where;
}

export function applyCustomOwnershipFilter<T>(
  where: WhereOptions<T>,
  userId: number,
  hasViewAll: boolean,
  customOwnershipFields: string[],
): WhereOptions<T> {
  if (!hasViewAll && customOwnershipFields.length > 0) {
    const ownershipConditions = customOwnershipFields.map((field) => ({
      [field]: { [Op.like]: `%${userId}%` },
    }));

    const ownershipFilter = {
      [Op.or]: ownershipConditions,
    };

    if (where[Op.and]) {
      (where[Op.and] as any[]).push(ownershipFilter);
    } else if (Object.keys(where).length > 0) {
      where = {
        [Op.and]: [where, ownershipFilter],
      } as WhereOptions<T>;
    } else {
      where = ownershipFilter as WhereOptions<T>;
    }
  }
  return where;
}
