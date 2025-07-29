import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AssetCapacityService } from './asset-capacity.service';
import { CreateAssetCapacityDto } from './dto/create-asset-capacity.dto';
import { UpdateAssetCapacityDto } from './dto/update-asset-capacity.dto';
import { FilterAssetCapacityDto } from './dto/filter-asset-capacity.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';

@ApiTags('Settings - Asset Capacity')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings/asset-capacity')
export class AssetCapacityController {
  constructor(private readonly service: AssetCapacityService) {}

  @Post()
  @PermissionCheck('settings', 'C')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create Asset Capacity' })
  create(@Body() dto: CreateAssetCapacityDto, @Req() req: Request) {
    const userId = (req as any).user.userId;
    return this.service.create(dto, userId);
  }

  @Put(':id')
  @PermissionCheck('settings', 'E')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Update Asset Capacity' })
  update(
    @Param('id') id: number,
    @Body() dto: UpdateAssetCapacityDto,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.userId;
    return this.service.update(id, dto, userId);
  }

  @Get(':id')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get Asset Capacity by ID' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @PermissionCheck('settings', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete Asset Capacity' })
  remove(@Param('id') id: number) {
    return this.service.delete(id);
  }

  @Get()
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'List Asset Capacities (Paginated)' })
  findAll(@Query() filter: FilterAssetCapacityDto) {
    return this.service.findAll(filter);
  }

  @Get('options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Dropdown list for Asset Capacities' })
  dropdown() {
    return this.service.dropdown();
  }
}
