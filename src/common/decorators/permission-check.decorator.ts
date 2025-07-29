// src/common/decorators/permission-check.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const PERMISSION_CHECK_KEY = 'permission_check';

export const PermissionCheck = (module: string, action: string) =>
  SetMetadata(PERMISSION_CHECK_KEY, { module, action });
