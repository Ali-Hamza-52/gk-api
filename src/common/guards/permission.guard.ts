// src/common/guards/permission.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_CHECK_KEY } from '../decorators/permission-check.decorator';
import { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.get<{ module: string; action: string }>(
      PERMISSION_CHECK_KEY,
      context.getHandler(),
    );

    if (!permission) return true; // No permission check needed

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const ability = request.user?.ability || [];

    const hasPermission = ability.some(
      (perm) =>
        perm.module === permission.module &&
        (perm.action === permission.action ||
          (permission.action === 'V' && perm.action === 'VO') ||
          (permission.action === 'E' && perm.action === 'EO') ||
          (permission.action === 'D' && perm.action === 'DO')),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `You don't have permission to ${permission.action} ${permission.module}`,
      );
    }

    return true;
  }
}
