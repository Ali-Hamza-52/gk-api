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
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { UserLevel } from './user-level.entity';
import { InjectModel } from '@nestjs/sequelize';
import { AuthenticatedRequest } from '@/common/types/authenticated-request';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';
import { UseInterceptors } from '@nestjs/common';
import { PermissionGuard } from '../common/guards/permission.guard';
import { PermissionCheck } from '../common/decorators/permission-check.decorator';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
    @InjectModel(UserLevel)
    private readonly userLevelModel: typeof UserLevel,
  ) {}

  @Post()
  @UseGuards(PermissionGuard)
  @PermissionCheck('user_level', 'C')
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'permission', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create new permissions' })
  create(@Body() dto: CreatePermissionDto, @Req() req: AuthenticatedRequest) {
    return this.permissionService.create(dto, req.user.userId);
  }

  @Get('/user-levels-dropdown')
  @UseGuards(PermissionGuard)
  @PermissionCheck('user_level', 'V')
  @ApiOperation({ summary: 'Get user levels for dropdown' })
  @ApiResponse({ status: 200, description: 'User levels fetched successfully' })
  async getUserLevelsDropdown() {
    const levels = await this.userLevelModel.findAll({
      attributes: ['id', 'name'],
      order: [['id', 'ASC']],
    });
    return { success: true, data: levels };
  }

  @Get()
  @UseGuards(PermissionGuard)
  @PermissionCheck('user_level', 'V')
  @ApiOperation({ summary: 'Get all permissions' })
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @PermissionCheck('user_level', 'V')
  @ApiOperation({ summary: 'Get permission by ID' })
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard)
  @PermissionCheck('user_level', 'E')
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'permission', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update permission by ID' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.permissionService.update(+id, dto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @PermissionCheck('user_level', 'D')
  @ApiOperation({ summary: 'Delete permission by ID' })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }

  @Get('/by-role/:role')
  @UseGuards(PermissionGuard)
  @PermissionCheck('user_level', 'V')
  @ApiOperation({ summary: 'Get permissions by user role id' })
  async getPermissionsByRole(@Param('role') role: number) {
    const permissions =
      await this.permissionService.getFullPermissionsByRole(role);
    return { success: true, data: permissions };
  }

  @Get('role/:role/module/:module')
  @UseGuards(PermissionGuard)
  @PermissionCheck('user_level', 'V')
  @ApiOperation({
    summary: 'Get the CSV actions string for one module by role',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns { module, action }',
    schema: {
      example: { module: 'users', action: 'C,R,U,D' },
    },
  })
  async getModuleActionsByRole(
    @Param('role') role: string,
    @Param('module') moduleKey: string,
  ) {
    const result = await this.permissionService.getModuleActionsByRole(
      +role,
      moduleKey,
    );
    return { success: true, data: result };
  }
}
