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
import { AssetMakeService } from './asset-make.service';
import { CreateAssetMakeDto } from './dto/create-asset-make.dto';
import { UpdateAssetMakeDto } from './dto/update-asset-make.dto';
import { FilterAssetMakeDto } from './dto/filter-asset-make.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';

@ApiTags('Settings - Asset Make')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings/asset-make')
export class AssetMakeController {
  constructor(private readonly service: AssetMakeService) {}

  @Post()
  @PermissionCheck('settings', 'C')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create Asset Make' })
  create(@Body() dto: CreateAssetMakeDto, @Req() req: Request) {
    const userId = (req as any).user.userId;
    return this.service.create(dto, userId);
  }

  @Put(':id')
  @PermissionCheck('settings', 'E')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Update Asset Make' })
  update(
    @Param('id') id: number,
    @Body() dto: UpdateAssetMakeDto,
    @Req() req: Request,
  ) {
    const userId = (req as any).user.userId;
    return this.service.update(id, dto, userId);
  }

  @Get(':id')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get Asset Make by ID' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @PermissionCheck('settings', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete Asset Make' })
  remove(@Param('id') id: number) {
    return this.service.delete(id);
  }

  @Get()
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'List Asset Makes (Paginated)' })
  findAll(@Query() filter: FilterAssetMakeDto) {
    return this.service.findAll(filter);
  }

  @Get('options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Dropdown list for Asset Makes' })
  dropdown() {
    return this.service.dropdown();
  }
}
