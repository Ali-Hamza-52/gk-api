import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionMatrixService } from './permission-matrix.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { PermissionCheck } from '../common/decorators/permission-check.decorator';

@ApiTags('Permission Modules')
@Controller('permissions/modules')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PermissionModulesController {
  constructor(
    private readonly permissionMatrixService: PermissionMatrixService,
  ) {}

  @Get()
  @UseGuards(PermissionGuard)
  @PermissionCheck('settings', 'V')
  @ApiOperation({ summary: 'Get all available modules dynamically' })
  @ApiResponse({
    status: 200,
    description: 'Available modules fetched successfully',
  })
  getAvailableModules() {
    return this.permissionMatrixService.getAvailableModules();
  }

  @Get('grouped')
  @UseGuards(PermissionGuard)
  @PermissionCheck('settings', 'V')
  @ApiOperation({ summary: 'Get modules grouped by category' })
  @ApiResponse({
    status: 200,
    description: 'Grouped modules fetched successfully',
  })
  getModulesGrouped() {
    return this.permissionMatrixService.getModulesGrouped();
  }
}
