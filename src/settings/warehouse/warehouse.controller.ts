import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { FilterWarehouseDto } from './dto/filter-warehouse.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Settings - Warehouses')
@Controller('settings/warehouses')
export class WarehouseController {
  constructor(private readonly svc: WarehouseService) {}

  @Post()
  @PermissionCheck('settings', 'C')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create warehouse' })
  async create(
    @Body() dto: CreateWarehouseDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.svc.create(dto, Number(req.user.userId));
  }

  @Get()
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'List warehouses with filter & pagination' })
  async findAll(@Query() filter: FilterWarehouseDto) {
    return this.svc.findAll(filter);
  }

  @Get(':id')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get warehouse by ID' })
  async findOne(@Param('id') id: number) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @PermissionCheck('settings', 'E')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Update warehouse' })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateWarehouseDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.svc.update(id, dto, Number(req.user.userId));
  }

  @Delete(':id')
  @PermissionCheck('settings', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete warehouse' })
  async remove(@Param('id') id: number) {
    return this.svc.delete(id);
  }

  @Get('options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Dropdown list of warehouses' })
  async dropdown() {
    return this.svc.dropdown();
  }

  @Get('summary')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Summary of warehouses' })
  async summary() {
    return this.svc.summary();
  }
}
