import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FilterRoleDto } from './dto/filter-role.dto';
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

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(PermissionGuard)
  @PermissionCheck('settings', 'C')
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'roles', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Role with this name already exists',
  })
  create(
    @Body() createRoleDto: CreateRoleDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.roleService.create(createRoleDto, req.user.userId);
  }

  @Get()
  @UseGuards(PermissionGuard)
  @PermissionCheck('settings', 'V')
  @ApiOperation({ summary: 'Get all roles with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Roles fetched successfully' })
  findAll(@Query() filterDto: FilterRoleDto) {
    return this.roleService.findAll(filterDto);
  }

  @Get('dropdown')
  @UseGuards(PermissionGuard)
  @PermissionCheck('settings', 'V')
  @ApiOperation({ summary: 'Get roles dropdown list' })
  @ApiResponse({
    status: 200,
    description: 'Roles dropdown fetched successfully',
  })
  dropdown() {
    return this.roleService.dropdown();
  }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @PermissionCheck('settings', 'V')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role fetched successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard)
  @PermissionCheck('settings', 'E')
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'roles', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.roleService.update(+id, updateRoleDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @PermissionCheck('settings', 'D')
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'roles', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Delete role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete role with assigned users',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }

  @Get(':id/users')
  @UseGuards(PermissionGuard)
  @PermissionCheck('settings', 'V')
  @ApiOperation({ summary: 'Get users assigned to a specific role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role users fetched successfully' })
  getRoleUsers(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
  ) {
    return this.roleService.getRoleUsers(+id, page, perPage);
  }
}
