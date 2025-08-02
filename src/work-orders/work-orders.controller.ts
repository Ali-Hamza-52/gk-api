import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { AuthenticatedRequest } from '@/common/types/authenticated-request';
import { WorkOrderService } from './work-orders.service';
import { CreateWorkOrderDto } from './dto/create-work-orders.dto';
import { UpdateWorkOrderDto } from './dto/update-work-orders.dto';
import { FilterWorkOrderDto } from './dto/work-order-filter.dto';
import { WorkOrderSummaryDto } from './dto/work-order-summary.dto';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { UserThrottlerGuard } from '@/common/guards/user-throttler.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Work Orders')
@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrderService: WorkOrderService) {}

  // GET /work-orders/summary - Get summary with optional client filter
  @Get('summary')
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'Get work orders summary statistics',
    description:
      'Get count of work orders by status with optional client filtering',
  })
  @ApiOkResponse({
    description: 'Work orders summary retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Work orders summary fetched successfully',
        data: {
          totalWorkOrders: 150,
          statusCounts: {
            Requested: 25,
            Diagnosed: 10,
            'In-Progress': 45,
            Completed: 60,
            Rejected: 5,
            Rework: 3,
            Warranty: 2,
          },
          priorityCounts: {
            Critical: 5,
            High: 15,
            Medium: 80,
            Low: 40,
            Routine: 10,
          },
        },
      },
    },
  })
  async getSummary(
    @Query() summaryDto: WorkOrderSummaryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    const roleId = Number(req.user.role);
    return await this.workOrderService.getSummary({
      ...summaryDto,
      userId,
      roleId,
    });
  }

  // GET /work-orders - Get all work orders with filters
  @Get()
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'Get all work orders with optional filters and pagination',
  })
  async findAll(
    @Query() filterDto: FilterWorkOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    const roleId = Number(req.user.role);
    return await this.workOrderService.findAll({
      ...filterDto,
      userId,
      roleId,
    });
  }

  // GET /work-orders/:id - Get single work order by ID
  @Get(':id')
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get work order by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Work order ID',
  })
  @ApiResponse({ status: 404, description: 'Work order not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.workOrderService.findOne(id);
  }

  // POST /work-orders - Create new work order
  @Post()
  @PermissionCheck('work_orders', 'C')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order', recordIdKey: 'id' })
  @ApiOperation({
    summary: 'Create new work order',
    description:
      'Create a new work order with optional services (when request_type = 1)',
  })
  @ApiBody({ type: CreateWorkOrderDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async create(
    @Body() createWorkOrderDto: CreateWorkOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.workOrderService.create(
      createWorkOrderDto,
      Number(req.user.userId),
    );
  }

  // PUT /work-orders/:id - Update work order
  @Put(':id')
  @PermissionCheck('work_orders', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @SkipThrottle()
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order', recordIdKey: 'id' })
  @ApiOperation({
    summary: 'Update work order',
    description: 'Update work order and optionally update associated services',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order ID' })
  @ApiBody({ type: UpdateWorkOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Work order updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Work order updated successfully',
        data: {
          id: 1,
          work_order_code: 'WO-CLIENT001-442-001',
          updated_at: '2025-07-29T16:00:00Z',
          servicesUpdated: true,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 404, description: 'Work order not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkOrderDto: UpdateWorkOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.workOrderService.update(
      id,
      updateWorkOrderDto,
      Number(req.user.userId),
    );
  }

  // PATCH /work-orders/:id - Partial update work order
  @Patch(':id')
  @PermissionCheck('work_orders', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @SkipThrottle()
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order', recordIdKey: 'id' })
  @ApiOperation({
    summary: 'Partial update of work order (PATCH)',
    description:
      'Update specific fields of a work order without affecting others',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order ID' })
  @ApiBody({ type: UpdateWorkOrderDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 404, description: 'Work order not found' })
  async partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() partialUpdateDto: Partial<UpdateWorkOrderDto>,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    return await this.workOrderService.partialUpdate(
      id,
      partialUpdateDto,
      userId,
    );
  }

  // DELETE /work-orders/:id - Delete work order
  @Delete(':id')
  @PermissionCheck('work_orders', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'Delete work order',
    description: 'Delete work order and all associated services (CASCADE)',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order ID' })
  @ApiResponse({
    status: 200,
    description: 'Work order deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'Work order and associated services deleted successfully',
        data: {
          id: 1,
          deletedServices: 3,
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Work order not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.workOrderService.remove(id);
  }
}
