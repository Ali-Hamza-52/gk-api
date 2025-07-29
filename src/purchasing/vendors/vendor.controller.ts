import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { ParseJsonArrayPipe } from 'src/common/pipes/parse-json-array.pipe'; // adjust path as needed
import { MulterFile } from './types/multer-file.type';
import { FilterVendorDto } from './dto/filter-vendor.dto';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { UserThrottlerGuard } from '@/common/guards/user-throttler.guard';

@ApiBearerAuth()
@ApiTags('Vendors')
@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get('options')
  @PermissionCheck('vendor', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Dropdown options for vendors (id + name)' })
  async getDropdownOptions() {
    return this.vendorService.getDropdownOptions();
  }

  @Get('summary')
  @PermissionCheck('vendor', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get totalRows & inCompleteVat for vendors' })
  async getSummary() {
    return this.vendorService.getSummary();
  }

  @Get()
  @PermissionCheck('vendor', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get list of vendors (with filters)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  getAll(
    @Query() filterDto: FilterVendorDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    const roleId = Number(req.user.role);
    return this.vendorService.getAll({ ...filterDto, userId, roleId });
  }

  @Post()
  @PermissionCheck('vendor', 'C')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'vendor', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Add vendor' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateVendorDto })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cr_file', maxCount: 1 },
      { name: 'vat_file', maxCount: 1 },
      { name: 'contract', maxCount: 1 },
    ]),
  )
  async createVendor(
    @Body() dto: CreateVendorDto,
    @UploadedFiles() files: Record<string, MulterFile[]>,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    return this.vendorService.create(dto, files, userId);
  }
  @Get(':id')
  @PermissionCheck('vendor', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get vendor detail' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Vendor detail returned' })
  getDetail(@Param('id') id: string) {
    return this.vendorService.getDetail(+id);
  }

  @Put(':id')
  @PermissionCheck('vendor', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'vendor', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update vendor' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateVendorDto })
  @UseInterceptors(AnyFilesInterceptor())
  update(
    @Param('id') id: string,
    @Body(ParseJsonArrayPipe) dto: UpdateVendorDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFiles() files?: any,
  ) {
    const userId = Number(req.user.userId);
    return this.vendorService.update(+id, dto, files, userId);
  }

  @Delete(':id')
  @PermissionCheck('vendor', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete vendor' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Vendor deleted' })
  remove(@Param('id') id: string) {
    return this.vendorService.delete(+id);
  }
}
