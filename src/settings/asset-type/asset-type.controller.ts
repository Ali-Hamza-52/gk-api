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
import { AssetTypeService } from './asset-type.service';
import { CreateAssetTypeDto } from './dto/create-asset-type.dto';
import { UpdateAssetTypeDto } from './dto/update-asset-type.dto';
import { FilterAssetTypeDto } from './dto/filter-asset-type.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';

@ApiTags('Settings - Asset Type')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings/asset-type')
export class AssetTypeController {
  constructor(private readonly service: AssetTypeService) {}

  @Post()
  @PermissionCheck('settings', 'C')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create Asset Type' })
  create(@Body() dto: CreateAssetTypeDto, @Req() req: Request) {
    const userId = (req as any).user.userId;
    return this.service.create(dto, userId);
  }

  @Put(':id')
  @PermissionCheck('settings', 'E')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Update Asset Type' })
  update(
    @Param('id') id: number,
    @Body() dto: UpdateAssetTypeDto,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.userId;
    return this.service.update(id, dto, userId);
  }

  @Get(':id')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get Asset Type by ID' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @PermissionCheck('settings', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete Asset Type' })
  remove(@Param('id') id: number) {
    return this.service.delete(id);
  }

  @Get()
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'List Asset Types (Paginated)' })
  findAll(@Query() filter: FilterAssetTypeDto) {
    return this.service.findAll(filter);
  }

  @Get('options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Dropdown list for Asset Types' })
  dropdown() {
    return this.service.dropdown();
  }
}
