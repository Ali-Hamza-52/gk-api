import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { FilterUnitDto } from './dto/filter-unit.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';

@ApiTags('Settings - Units')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings/units')
export class UnitController {
  constructor(private readonly service: UnitService) {}

  @Post()
  @PermissionCheck('settings', 'C')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create a new unit' })
  @ApiResponse({ status: 201, description: 'Unit created successfully' })
  create(@Body() dto: CreateUnitDto, @Req() req: AuthenticatedRequest) {
    return this.service.create(dto, req.user.userId);
  }

  @Get('/summary')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get summary report of units' })
  @ApiResponse({
    status: 200,
    description: 'Summary report fetched successfully',
  })
  summary() {
    return this.service.summary();
  }

  @Get('/options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get dropdown list of units' })
  @ApiResponse({ status: 200, description: 'Dropdown fetched successfully' })
  dropdown() {
    return this.service.dropdown();
  }

  @Patch(':id')
  @PermissionCheck('settings', 'E')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update unit by ID' })
  @ApiResponse({ status: 200, description: 'Unit updated successfully' })
  update(
    @Param('id') id: number,
    @Body() dto: UpdateUnitDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.update(id, dto, req.user.userId);
  }

  @Get(':id')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get unit by ID' })
  @ApiResponse({ status: 200, description: 'Unit fetched successfully' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @PermissionCheck('settings', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete unit by ID' })
  @ApiResponse({ status: 200, description: 'Unit deleted successfully' })
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }

  @Get()
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get list of units with pagination & search' })
  @ApiResponse({ status: 200, description: 'Units fetched successfully' })
  findAll(@Query() filter: FilterUnitDto) {
    return this.service.findAll(filter);
  }
}
