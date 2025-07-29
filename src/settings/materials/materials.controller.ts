import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MaterialService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { FilterMaterialDto } from './dto/filter-material.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';

@ApiTags('Materials')
@Controller('settings/materials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MaterialController {
  constructor(private readonly service: MaterialService) {}

  @Post()
  @PermissionCheck('settings', 'C')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create a new material' })
  @ApiResponse({ status: 201, description: 'Material created successfully' })
  create(@Body() dto: CreateMaterialDto, @Req() req: AuthenticatedRequest) {
    return this.service.create(dto, req.user.userId);
  }

  @Get('/options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get dropdown list of all materials' })
  @ApiResponse({ status: 200, description: 'Dropdown fetched successfully' })
  dropdown() {
    return this.service.dropdown();
  }

  @Get('/summary')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get material summary (e.g., total count)' })
  @ApiResponse({ status: 200, description: 'Summary fetched successfully' })
  summary() {
    return this.service.summary();
  }

  @Get()
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get paginated list of materials' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'searchTerm', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Materials fetched successfully' })
  findAll(@Query() filter: FilterMaterialDto) {
    return this.service.findAll(filter);
  }

  @Get(':id')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get material by ID' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Material fetched successfully' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @PermissionCheck('settings', 'E')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update a material' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Material updated successfully' })
  update(
    @Param('id') id: number,
    @Body() dto: UpdateMaterialDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @PermissionCheck('settings', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete a material by ID' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Material deleted successfully' })
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
