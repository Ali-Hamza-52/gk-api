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
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { UserThrottlerGuard } from '@/common/guards/user-throttler.guard';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { FilterAssetDto } from './dto/filter-asset.dto';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Assets')
@Controller('assets')
export class AssetController {
  constructor(private readonly svc: AssetService) {}

  @Post()
  @PermissionCheck('assets_managments', 'C')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @SkipThrottle()
  @UseInterceptors(AnyFilesInterceptor(), RequestLogInterceptor)
  @RequestLog({ module: 'asset', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAssetDto })
  async create(
    @Body() dto: CreateAssetDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    return this.svc.create(dto, files, userId);
  }

  @Get()
  @PermissionCheck('assets_managments', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'List all assets (with filtering & pagination)' })
  @ApiOkResponse({ description: 'Paginated list of assets' })
  async findAll(
    @Query() filter: FilterAssetDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    const roleId = Number(req.user.role);
    return this.svc.findAll({ ...filter, userId, roleId });
  }

  @Get('summary')
  @PermissionCheck('assets_managments', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get summary of assets (status counts)' })
  @ApiOkResponse({ description: 'Summary of all assets' })
  async summary() {
    return this.svc.summary();
  }

  @Get('dropdown')
  @PermissionCheck('assets_managments', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Dropdown list for Assets' })
  async dropdown() {
    return this.svc.dropdown();
  }

  @Get(':id')
  @PermissionCheck('assets_managments', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get one asset by its ID' })
  @ApiOkResponse({ description: 'Asset details' })
  async findOne(@Param('id') id: number) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @PermissionCheck('assets_managments', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @SkipThrottle()
  @UseInterceptors(AnyFilesInterceptor(), RequestLogInterceptor)
  @RequestLog({ module: 'asset', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update an existing asset' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAssetDto })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateAssetDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    return this.svc.update(id, dto, files, userId);
  }

  @Delete(':id')
  @PermissionCheck('assets_managments', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete an asset by ID' })
  @ApiOkResponse({ description: 'Deletion result' })
  async remove(@Param('id') id: number) {
    return this.svc.remove(id);
  }
}
