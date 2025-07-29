import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { AssignRoleDto, BulkAssignRoleDto } from './dto/assign-role.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { PermissionCheck } from '../common/decorators/permission-check.decorator';
import { AuthenticatedRequest } from '../common/types/authenticated-request';
import { RequestLogInterceptor } from '../common/interceptors/request-log.interceptor';
import { RequestLog } from '../common/decorators/request-log.decorator';

@ApiTags('User Role Assignment')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserRoleAssignmentController {
  constructor(private readonly roleService: RoleService) {}

  @Post(':id/assign-role')
  @UseGuards(PermissionGuard)
  @PermissionCheck('user', 'E')
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'user_roles', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Role assigned successfully' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  assignRole(
    @Param('id') userId: string,
    @Body() assignRoleDto: AssignRoleDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.roleService.assignRoleToUser(
      +userId,
      assignRoleDto.role_id,
      req.user.userId,
    );
  }

  @Delete(':id/remove-role')
  @UseGuards(PermissionGuard)
  @PermissionCheck('user', 'E')
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'user_roles', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Remove role from user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Role removed successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  removeRole(@Param('id') userId: string, @Req() req: AuthenticatedRequest) {
    return this.roleService.removeRoleFromUser(+userId, req.user.userId);
  }

  @Get(':id/roles')
  @UseGuards(PermissionGuard)
  @PermissionCheck('user', 'V')
  @ApiOperation({ summary: 'Get user role information' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User role fetched successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserRole(@Param('id') userId: string) {
    return this.roleService.getUserRole(+userId);
  }

  @Put('bulk-assign-roles')
  @UseGuards(PermissionGuard)
  @PermissionCheck('user', 'E')
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'user_roles', recordIdKey: 'user_ids' })
  @ApiOperation({ summary: 'Bulk assign role to multiple users' })
  @ApiResponse({ status: 200, description: 'Roles assigned successfully' })
  @ApiResponse({ status: 400, description: 'Some users not found' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  bulkAssignRoles(
    @Body() bulkAssignDto: BulkAssignRoleDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.roleService.bulkAssignRoles(bulkAssignDto, req.user.userId);
  }
}
