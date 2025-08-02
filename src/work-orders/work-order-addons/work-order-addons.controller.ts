// src/work-orders/work-order-addons/work-order-addons.controller.ts

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
  ApiQuery,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { AuthenticatedRequest } from '@/common/types/authenticated-request';
import { WorkOrderAddonsService } from './work-order-addons.service';
import { CreateWorkOrderAddonDto } from './dto/create-work-order-addon.dto';
import {
  UpdateWorkOrderAddonDto,
  PatchWorkOrderAddonDto,
} from './dto/update-work-order-addon.dto';
import { FilterWorkOrderAddonDto } from './dto/filter-work-order-addon.dto';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { UserThrottlerGuard } from '@/common/guards/user-throttler.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Work Order Addons')
@Controller('work-order-addons')
export class WorkOrderAddonsController {
  constructor(
    private readonly workOrderAddonsService: WorkOrderAddonsService,
  ) {}

  // GET /work-order-addons/options - Get dropdown options
  @Get('options')
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'Get dropdown options for work order addons',
    description: 'Get work orders for dropdown selection',
  })
  @ApiOkResponse({
    description: 'Dropdown options retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Dropdown options fetched successfully',
        data: {
          workOrders: [{ id: 1012, work_order_code: 'WO-CLIENT001-442-001' }],
        },
      },
    },
  })
  async getDropdownOptions() {
    return await this.workOrderAddonsService.getDropdownOptions();
  }

  // GET /work-order-addons/summary - Get summary statistics
  @Get('summary')
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'Get work order addons summary statistics',
    description: 'Get count and total value of approved and unapproved addons',
  })
  @ApiOkResponse({
    description: 'Work order addons summary retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Work order addons summary fetched successfully',
        data: {
          totalAddons: 25,
          totalValue: 45750.5,
          approvedAddons: {
            count: 18,
            totalValue: 32500.0,
          },
          unapprovedAddons: {
            count: 7,
            totalValue: 13250.5,
          },
        },
      },
    },
  })
  async getSummary() {
    return await this.workOrderAddonsService.getSummary();
  }

  // GET /work-order-addons - Get all work order addons with filters
  @Get()
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'Get all work order addons with optional filters and pagination',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 10 })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    description: 'Search by addon ID, work order ID, description',
  })
  @ApiQuery({
    name: 'addon_type',
    required: false,
    description: 'Filter by addon type (Platform, Crane, Transport, Custom)',
  })
  async findAll(
    @Query() filterDto: FilterWorkOrderAddonDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    const roleId = Number(req.user.role);
    return await this.workOrderAddonsService.findAll({
      ...filterDto,
      userId,
      roleId,
    });
  }

  // GET /work-order-addons/:id - Get single work order addon by ID
  @Get(':id')
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get work order addon by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Work order addon ID',
  })
  @ApiResponse({ status: 404, description: 'Work order addon not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.workOrderAddonsService.findOne(id);
  }

  // POST /work-order-addons - Create new work order addon
  @Post()
  @PermissionCheck('work_orders', 'C')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order_addons', recordIdKey: 'id' })
  @ApiOperation({
    summary: 'Create new work order addon',
    description: 'Create a new work order addon with specified type and price',
  })
  @ApiBody({ type: CreateWorkOrderAddonDto })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async create(
    @Body() createWorkOrderAddonDto: CreateWorkOrderAddonDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.workOrderAddonsService.create(
      createWorkOrderAddonDto,
      Number(req.user.userId),
    );
  }

  // PUT /work-order-addons/:id - Update work order addon
  @Put(':id')
  @PermissionCheck('work_orders', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order_addons', recordIdKey: 'id' })
  @ApiOperation({
    summary: 'Update work order addon',
    description: 'Update work order addon details',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order addon ID' })
  @ApiBody({ type: UpdateWorkOrderAddonDto })
  @ApiResponse({
    status: 200,
    description: 'Work order addon updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Work order addon updated successfully',
        data: {
          id: 15,
          work_order_id: 1012,
          addon_type: 'Crane',
          description: 'Heavy duty crane for lifting equipment',
          price: 2500.0,
          updated_at: '2025-07-29T16:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 404, description: 'Work order addon not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkOrderAddonDto: UpdateWorkOrderAddonDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.workOrderAddonsService.update(
      id,
      updateWorkOrderAddonDto,
      Number(req.user.userId),
    );
  }

  // PATCH /work-order-addons/:id - Partial update work order addon
  @Patch(':id')
  @PermissionCheck('work_orders', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order_addons', recordIdKey: 'id' })
  @ApiOperation({
    summary: 'Partial update of work order addon (PATCH)',
    description:
      'Update specific fields of a work order addon without affecting others',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order addon ID' })
  @ApiBody({ type: PatchWorkOrderAddonDto })
  @ApiResponse({
    status: 200,
    description: 'Work order addon partially updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Work order addon partially updated successfully',
        data: {
          id: 15,
          work_order_id: 1012,
          addon_type: 'Crane',
          description: 'Heavy duty crane for lifting equipment',
          price: 2500.0,
          updated_at: '2025-07-29T16:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 404, description: 'Work order addon not found' })
  async partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() partialUpdateDto: Partial<PatchWorkOrderAddonDto>,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    return await this.workOrderAddonsService.partialUpdate(
      id,
      partialUpdateDto,
      userId,
    );
  }

  // DELETE /work-order-addons/:id - Delete work order addon
  @Delete(':id')
  @PermissionCheck('work_orders', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'Delete work order addon',
    description: 'Delete work order addon by ID',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order addon ID' })
  @ApiResponse({ status: 404, description: 'Work order addon not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.workOrderAddonsService.remove(id);
  }
}
