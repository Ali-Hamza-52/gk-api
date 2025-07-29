import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined)
    throw new Error(`Environment variable ${key} is missing`);
  return value;
}

import { PermissionResource } from '../permissions/entities/permission-resource.entity';
import { PermissionAction } from '../permissions/entities/permission-action.entity';
import { PermissionRole } from '../permissions/entities/permission-role.entity';
import { UserLevel } from '../permissions/user-level.entity';
import { User } from '../users/user.entity';

export const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: getEnv('DB_HOST'),
  port: parseInt(getEnv('DB_PORT'), 10),
  username: getEnv('DB_USER'),
  password: getEnv('DB_PASS'),
  database: getEnv('DB_NAME'),
  models: [PermissionResource, PermissionAction, PermissionRole, UserLevel, User],
  autoLoadModels: true,
  synchronize: false,
  logging: false,
};
