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
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { AuthenticatedRequest } from '@/common/types/authenticated-request';
import { WorkOrderService } from './work-orders.service';
import { CreateWorkOrderDto } from './dto/create-work-orders.dto';
import { UpdateWorkOrderDto } from './dto/update-work-orders.dto';
import { WorkOrderFilterDto } from './dto/work-order-filter.dto';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { UserThrottlerGuard } from '@/common/guards/user-throttler.guard';
import { WorkOrderStatus } from './entities/work-orders.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Work Orders')
@Controller('work-orders')
export class WorkOrderController {
  constructor(private readonly workOrderService: WorkOrderService) {}

  @Post()
  @PermissionCheck('work_orders', 'C')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create new work order' })
  @ApiBody({ type: CreateWorkOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Work order created successfully',
    schema: {
      example: {
        success: true,
        message: 'Work order created successfully',
        data: {
          id: 1,
          work_order_code: 'WO-2025-0001',
          client_id: 1054,
          location_id: 442,
          status: 'REQUESTED',
          priority: 1,
          contact_person: 'Salman Arif',
          contact_number: '+966501234567',
          requested_by: 15,
          sla_due_at: '2025-07-14T17:00:00Z',
        },
      },
    },
  })
  async create(
    @Body() dto: CreateWorkOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workOrderService.create(dto, Number(req.user.userId));
  }

  @Get('summary')
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'Get work order summary with status and priority counts',
  })
  @ApiOkResponse({
    description: 'Returns summary of work orders with various metrics',
    schema: {
      example: {
        success: true,
        message: 'Work order summary fetched successfully',
        data: {
          total: 150,
          statusCounts: [
            { status: 'REQUESTED', count: 25 },
            { status: 'IN_PROGRESS', count: 45 },
            { status: 'COMPLETED', count: 60 },
          ],
          priorityCounts: [
            { priority: 1, count: 10 },
            { priority: 2, count: 30 },
            { priority: 3, count: 50 },
          ],
          overdue: 8,
          dueSoon: 12,
        },
      },
    },
  })
  async getWorkOrderSummary() {
    return this.workOrderService.getWorkOrderSummary();
  }

  @Get('status/:status')
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get work orders by status' })
  @ApiParam({
    name: 'status',
    enum: WorkOrderStatus,
    description: 'Work order status',
  })
  async getWorkOrdersByStatus(@Param('status') status: WorkOrderStatus) {
    return this.workOrderService.getWorkOrdersByStatus(status);
  }

  @Get()
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'List work orders with filter & pagination' })
  @ApiOkResponse({
    description: 'Returns paginated list of work orders',
    schema: {
      example: {
        success: true,
        message: 'Work orders fetched successfully',
        data: {
          items: [
            {
              id: 1,
              work_order_code: 'WO-2025-0001',
              client_id: 1054,
              location_id: 442,
              status: 'IN_PROGRESS',
              priority: 1,
              contact_person: 'Salman Arif',
              contact_number: '+966501234567',
              requested_by: 15,
              sla_due_at: '2025-07-14T17:00:00Z',
            },
          ],
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
          perPage: 10,
        },
      },
    },
  })
  async findAll(
    @Query() filterDto: WorkOrderFilterDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    const roleId = Number(req.user.role);
    return this.workOrderService.findAll(filterDto, userId, roleId);
  }

  @Get(':id')
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get work order by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order ID' })
  @ApiOkResponse({
    description: 'Returns work order details',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workOrderService.findOne(id);
  }

  // @Patch(':id')
  // @PermissionCheck('work_orders', 'E')
  // @UseGuards(PermissionGuard, UserThrottlerGuard)
  // @Throttle({ default: { limit: 50, ttl: 3600000 } })
  // @UseInterceptors(RequestLogInterceptor)
  // @RequestLog({ module: 'work_order', recordIdKey: 'id' })
  // @ApiOperation({ summary: 'Partially update work order (PATCH)' })
  // @ApiParam({ name: 'id', type: 'number', description: 'Work order ID' })
  // @ApiBody({
  //   description:
  //     'Partial work order update data - only send fields you want to change',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       priority: {
  //         type: 'number',
  //         enum: [1, 2, 3, 4, 5],
  //         example: 2,
  //         description: 'Update priority only',
  //       },
  //       contact_person: {
  //         type: 'string',
  //         example: 'New Contact Person',
  //         description: 'Update contact person only',
  //       },
  //       contact_number: {
  //         type: 'string',
  //         example: '+966501111111',
  //         description: 'Update contact number only',
  //       },
  //       status: {
  //         type: 'string',
  //         enum: [
  //           'REQUESTED',
  //           'DIAGNOSED',
  //           'IN_PROGRESS',
  //           'COMPLETED',
  //           'CANCELLED',
  //           'REWORK',
  //           'WARRANTY',
  //         ],
  //         example: 'IN_PROGRESS',
  //         description: 'Update status only',
  //       },
  //       assigned_technician: {
  //         type: 'number',
  //         example: 35,
  //         description: 'Update assigned technician only',
  //       },
  //       sla_due_at: {
  //         type: 'string',
  //         format: 'date-time',
  //         example: '2025-08-01T12:00:00Z',
  //         description: 'Update SLA deadline only',
  //       },
  //       feedback_rating: {
  //         type: 'number',
  //         minimum: 1,
  //         maximum: 5,
  //         example: 4,
  //         description: 'Update customer rating only',
  //       },
  //       feedback_comments: {
  //         type: 'string',
  //         example: 'Updated feedback',
  //         description: 'Update feedback comments only',
  //       },
  //       reopened_as_warranty: {
  //         type: 'boolean',
  //         example: true,
  //         description: 'Update warranty status only',
  //       },
  //     },
  //     additionalProperties: false,
  //   },
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Work order partially updated successfully',
  //   schema: {
  //     example: {
  //       success: true,
  //       message: 'Work order updated successfully',
  //       data: {
  //         id: 123,
  //         work_order_code: 'WO-ACME-442-123',
  //         priority: 2,
  //         status: 'IN_PROGRESS',
  //         updated_fields: ['priority', 'status'],
  //         updatedAt: '2025-07-28T15:30:00Z',
  //       },
  //     },
  //   },
  // })
  // async patchWorkOrder(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() patchData: Partial<UpdateWorkOrderDto>,
  //   @Req() req: AuthenticatedRequest,
  // ) {
  //   return this.workOrderService.patchWorkOrder(
  //     id,
  //     patchData,
  //     Number(req.user.userId),
  //   );
  // }

  @Put(':id')
  @PermissionCheck('work_orders', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update work order' })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order ID' })
  @ApiBody({ type: UpdateWorkOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Work order updated successfully',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workOrderService.update(id, dto, Number(req.user.userId));
  }

  @Delete(':id')
  @PermissionCheck('work_orders', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete work order' })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order ID' })
  @ApiResponse({
    status: 200,
    description: 'Work order deleted successfully',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.workOrderService.remove(id);
  }

  @Put(':id/assign-technician')
  @PermissionCheck('work_orders', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 3600000 } })
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Assign technician to work order' })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        technician_id: {
          type: 'number',
          example: 25,
          description: 'Technician user ID',
        },
      },
      required: ['technician_id'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Technician assigned successfully',
  })
  async assignTechnician(
    @Param('id', ParseIntPipe) id: number,
    @Body('technician_id', ParseIntPipe) technicianId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.workOrderService.assignTechnician(
      id,
      technicianId,
      Number(req.user.userId),
    );
  }

  @Put(':id/complete')
  @PermissionCheck('work_orders', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 3600000 } })
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Mark work order as completed' })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        feedback_rating: {
          type: 'number',
          minimum: 1,
          maximum: 5,
          example: 4,
          description: 'Customer feedback rating (1-5)',
        },
        feedback_comments: {
          type: 'string',
          example: 'Work completed satisfactorily',
          description: 'Customer feedback comments',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Work order marked as completed',
  })
  async completeWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      feedback_rating?: number;
      feedback_comments?: string;
    },
    @Req() req: AuthenticatedRequest,
  ) {
    const updateDto: UpdateWorkOrderDto = {
      status: WorkOrderStatus.COMPLETED,
      completed_at: new Date().toISOString(),
      ...body,
    };

    return this.workOrderService.update(id, updateDto, Number(req.user.userId));
  }

  @Put(':id/cancel')
  @PermissionCheck('work_orders', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 3600000 } })
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Cancel work order' })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order ID' })
  @ApiResponse({
    status: 200,
    description: 'Work order cancelled successfully',
  })
  async cancelWorkOrder(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const updateDto: UpdateWorkOrderDto = { status: WorkOrderStatus.CANCELLED };

    return this.workOrderService.update(id, updateDto, Number(req.user.userId));
  }
}
