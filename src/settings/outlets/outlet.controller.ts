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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { OutletService } from './outlet.service';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { FilterOutletDto } from './dto/filter-outlet.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Settings - Outlets')
@Controller('settings/outlets')
export class OutletController {
  constructor(private readonly svc: OutletService) {}

  @Post()
  @PermissionCheck('settings', 'C')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create outlet' })
  async create(@Body() dto: CreateOutletDto, @Req() req: AuthenticatedRequest) {
    return this.svc.create(dto, Number(req.user.userId));
  }

  @Get()
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'List outlets with filter & pagination' })
  async findAll(@Query() filter: FilterOutletDto) {
    return this.svc.findAll(filter);
  }

  @Get(':id')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get outlet by ID' })
  async findOne(@Param('id') id: number) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update outlet' })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateOutletDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.svc.update(id, dto, Number(req.user.userId));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete outlet' })
  async remove(@Param('id') id: number) {
    return this.svc.delete(id);
  }

  @Get('options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Dropdown list of outlets' })
  async dropdown() {
    return this.svc.dropdown();
  }

  @Get('summary')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Summary of outlets' })
  async summary() {
    return this.svc.summary();
  }
}
