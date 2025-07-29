import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { PermissionMatrixService } from './permission-matrix.service';
import { UpdatePermissionMatrixDto } from './dto/permission-matrix.dto';
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

@ApiTags('Permission Matrix')
@Controller('permission-matrix')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PermissionMatrixController {
  constructor(
    private readonly permissionMatrixService: PermissionMatrixService,
  ) {}

  @Get('modulelist')
  @UseGuards(PermissionGuard)
  @PermissionCheck('settings', 'V')
  @ApiOperation({
    summary:
      'Get all permission resources grouped by module group and sorted by name',
  })
  @ApiResponse({
    status: 200,
    description: 'Modules list fetched successfully',
  })
  getModulesList() {
    return this.permissionMatrixService.getModulesList();
  }

  @Get('actionslist')
  @UseGuards(PermissionGuard)
  @PermissionCheck('settings', 'V')
  @ApiOperation({ summary: 'Get all permission actions sorted by ID' })
  @ApiResponse({
    status: 200,
    description: 'Actions list fetched successfully',
  })
  getActionsList() {
    return this.permissionMatrixService.getActionsList();
  }

  @Get(':roleId')
  @UseGuards(PermissionGuard)
  @PermissionCheck('settings', 'V')
  @ApiOperation({ summary: 'Get complete permission matrix for role' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Permission matrix fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  getPermissionMatrix(@Param('roleId') roleId: string) {
    return this.permissionMatrixService.getPermissionMatrix(+roleId);
  }

  @Put(':roleId')
  @UseGuards(PermissionGuard)
  @PermissionCheck('settings', 'E')
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'permission_matrix', recordIdKey: 'roleId' })
  @ApiOperation({ summary: 'Update multiple module permissions at once' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiResponse({
    status: 200,
    description: 'Permission matrix updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  updatePermissionMatrix(
    @Param('roleId') roleId: string,
    @Body() updateDto: UpdatePermissionMatrixDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.permissionMatrixService.updatePermissionMatrix(
      +roleId,
      updateDto,
      req.user.userId,
    );
  }

  @Get('permission-check/:module')
  @UseGuards(PermissionGuard)
  @PermissionCheck('settings', 'V')
  @ApiOperation({ summary: 'Get current user permissions for specific module' })
  @ApiParam({
    name: 'module',
    description: 'Module name to check permissions for',
  })
  @ApiResponse({
    status: 200,
    description: 'User permissions for module retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User or module not found' })
  async checkUserPermission(
    @Param('module') module: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.permissionMatrixService.checkUserPermission(
      req.user.userId,
      module,
    );
  }
}
