import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { WorkOrderServicesService } from './work-order-services.service';
import { CreateWorkOrderServiceDto } from './dto/create-work-order-service.dto';
import {
  UpdateWorkOrderServiceDto,
  PatchWorkOrderServiceDto,
} from './dto/update-work-order-service.dto';
import { FilterWorkOrderServiceDto } from './dto/filter-work-order-service.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { UserThrottlerGuard } from '@/common/guards/user-throttler.guard';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';

@ApiTags('Work Order Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('work-order-services')
export class WorkOrderServicesController {
  constructor(private readonly service: WorkOrderServicesService) {}

  @Get('options')
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary:
      'Get dropdown options for work order services (Work Orders, Services, Task Statuses)',
  })
  async getDropdownOptions() {
    return this.service.getDropdownOptions();
  }

  @Get('summary')
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get work order services summary statistics' })
  async getSummary() {
    return this.service.getSummary();
  }

  @Post()
  @PermissionCheck('work_orders', 'C')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @SkipThrottle()
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order_services', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create a new work order service' })
  @ApiBody({
    type: CreateWorkOrderServiceDto,
    description: 'Work order service creation data',
  })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateWorkOrderServiceDto,
  ) {
    const userId = Number(req.user.userId);
    return this.service.create(dto, userId);
  }

  @Get()
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'List work order services with pagination and search',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 10 })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    description: 'Search by ID, work order ID, or service name',
  })
  @ApiQuery({
    name: 'work_order_id',
    required: false,
    description: 'Filter by work order ID',
  })
  @ApiQuery({
    name: 'service_id_link',
    required: false,
    description: 'Filter by service ID',
  })
  @ApiQuery({
    name: 'task_status',
    required: false,
    description: 'Filter by task status',
  })
  @ApiQuery({
    name: 'approved_by_userid',
    required: false,
    description: 'Filter by approver user ID',
  })
  async findAll(
    @Query() filterDto: FilterWorkOrderServiceDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    const roleId = Number(req.user.role);
    return this.service.findAll({ ...filterDto, userId, roleId });
  }

  @Get(':id')
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get work order service by ID' })
  @ApiParam({ name: 'id', description: 'Work order service ID' })
  @ApiOkResponse({
    description: 'Work order service details',
    schema: {
      example: {
        success: true,
        message: 'Work order service fetched successfully',
        data: {
          id: 1,
          work_order_id: 1012,
          service_id_link: 5,
          task_status: 'In Progress',
          approved_by_client: true,
          approved_by_userid: 101,
          approved_date: '2025-07-14T12:00:00Z',
          workOrder: { id: 1012, work_order_number: 'WO-2025-001' },
          service: { id: 5, service_name: 'AC Maintenance', category: 'HVAC' },
          approvedByUser: { id: 101, first_name: 'John', last_name: 'Doe' },
        },
      },
    },
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @PermissionCheck('work_orders', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @SkipThrottle()
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order_services', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update work order service completely' })
  @ApiParam({ name: 'id', description: 'Work order service ID' })
  @ApiBody({
    type: UpdateWorkOrderServiceDto,
    description: 'Complete work order service update data',
  })
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkOrderServiceDto,
  ) {
    const userId = Number(req.user.userId);
    return this.service.update(id, dto, userId);
  }

  @Delete(':id')
  @PermissionCheck('work_orders', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete work order service by ID' })
  @ApiParam({ name: 'id', description: 'Work order service ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Patch(':id')
  @PermissionCheck('work_orders', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @SkipThrottle()
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order_services', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Partially update work order service' })
  @ApiParam({ name: 'id', description: 'Work order service ID' })
  @ApiBody({
    type: PatchWorkOrderServiceDto,
    description: 'Fields to update (all fields are optional for PATCH)',
    required: true,
  })
  async partialUpdate(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<PatchWorkOrderServiceDto>,
  ) {
    const userId = Number(req.user.userId);
    return this.service.partialUpdate(id, dto, userId);
  }
}
