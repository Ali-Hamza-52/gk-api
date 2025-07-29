import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FmServiceSettingsService } from './fm-service-settings.service';
import { CreateFmServiceSettingsDto } from './dto/create-fm-service-settings.dto';
import { UpdateFmServiceSettingsDto } from './dto/update-fm-service-settings.dto';
import { FilterFmServiceSettingsDto } from './dto/filter-fm-service-settings.dto';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';

@ApiTags('FM Service Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings/fm-service-settings')
export class FmServiceSettingsController {
  constructor(private readonly service: FmServiceSettingsService) {}

  @Post()
  @PermissionCheck('settings', 'C')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create FM service setting' })
  @ApiResponse({
    status: 201,
    description: 'FM service setting created successfully',
  })
  create(
    @Body() dto: CreateFmServiceSettingsDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.create(dto, Number(req.user.userId));
  }

  @Get()
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get all FM service settings (paginated)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'is_active', required: false })
  @ApiQuery({ name: 'building_type', required: false })
  @ApiResponse({
    status: 200,
    description: 'FM service settings fetched successfully',
  })
  findAll(@Query() filter: FilterFmServiceSettingsDto) {
    return this.service.findAll(filter);
  }

  @Get('options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get dropdown options for FM service settings' })
  @ApiResponse({
    status: 200,
    description: 'Dropdown options fetched successfully',
  })
  dropdown() {
    return this.service.dropdown();
  }

  @Get(':id')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get FM service setting by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'FM service setting fetched successfully',
  })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @PermissionCheck('settings', 'E')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update FM service setting' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'FM service setting updated successfully',
  })
  update(
    @Param('id') id: number,
    @Body() dto: UpdateFmServiceSettingsDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.update(id, dto, Number(req.user.userId));
  }

  @Delete(':id')
  @PermissionCheck('settings', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete FM service setting' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'FM service setting deleted successfully',
  })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
