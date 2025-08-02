// src/work-orders/work-order-parts/work-order-parts.controller.ts

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
import { WorkOrderPartsService } from './work-order-part.service';
import { CreateWorkOrderPartDto } from './dto/create-work-order-part.dto';
import {
  UpdateWorkOrderPartDto,
  PatchWorkOrderPartDto,
} from './dto/update-work-order-part.dto';
import { FilterWorkOrderPartDto } from './dto/filter-work-order-part.dto';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { UserThrottlerGuard } from '@/common/guards/user-throttler.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Work Order Parts')
@Controller('work-order-parts')
export class WorkOrderPartsController {
  constructor(private readonly workOrderPartsService: WorkOrderPartsService) {}

  // GET /work-order-parts/options - Get dropdown options
  @Get('options')
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'Get dropdown options for work order parts',
    description:
      'Get work orders, work order services, materials, and suppliers for dropdowns',
  })
  async getDropdownOptions() {
    return await this.workOrderPartsService.getDropdownOptions();
  }

  // GET /work-order-parts/summary - Get summary statistics
  @Get('summary')
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'Get work order parts summary statistics',
    description: 'Get count and total value of approved and unapproved parts',
  })
  @ApiOkResponse({
    description: 'Work order parts summary retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Work order parts summary fetched successfully',
        data: {
          totalParts: 45,
          totalValue: 12750.5,
          approvedParts: {
            count: 30,
            totalValue: 8500.0,
          },
          unapprovedParts: {
            count: 15,
            totalValue: 4250.5,
          },
        },
      },
    },
  })
  async getSummary() {
    return await this.workOrderPartsService.getSummary();
  }

  // GET /work-order-parts - Get all work order parts with filters
  @Get()
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'Get all work order parts with optional filters and pagination',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 10 })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    description: 'Search by part ID, work order ID, material name, etc.',
  })
  @ApiQuery({
    name: 'work_order_id',
    required: false,
    description: 'Filter by work order ID',
  })
  @ApiQuery({
    name: 'work_order_service_id',
    required: false,
    description: 'Filter by work order service ID',
  })
  @ApiQuery({
    name: 'approved_by_client',
    required: false,
    description: 'Filter by approval status',
  })
  async findAll(
    @Query() filterDto: FilterWorkOrderPartDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    const roleId = Number(req.user.role);
    return await this.workOrderPartsService.findAll({
      ...filterDto,
      userId,
      roleId,
    });
  }

  // GET /work-order-parts/:id - Get single work order part by ID
  @Get(':id')
  @PermissionCheck('work_orders', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get work order part by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Work order part ID',
  })
  @ApiOkResponse({
    description: 'Work order part retrieved successfully',
    schema: {
      example: {
        success: true,
        message: 'Work order part fetched successfully',
        data: {
          id: 123,
          work_order_id: 1012,
          work_order_service_id: 25,
          part_id: 150,
          quantity: 5,
          unit_price: 125.5,
          total_price: 627.5,
          warranty_duration: 365,
          supplier_id: 42,
          approved_by_client: true,
          approved_by_userid: 101,
          approved_date: '2025-07-14T12:00:00Z',
          workOrder: { id: 1012, work_order_code: 'WO-CLIENT001-442-001' },
          material: {
            id: 150,
            material_name: 'AC Filter',
            material_code: 'MAT-001',
          },
          supplier: { id: 42, supplier_name: 'Tech Parts Co.' },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Work order part not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.workOrderPartsService.findOne(id);
  }

  // POST /work-order-parts - Create new work order part
  @Post()
  @PermissionCheck('work_orders', 'C')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order_parts', recordIdKey: 'id' })
  @ApiOperation({
    summary: 'Create new work order part',
    description:
      'Create a new work order part with auto-calculated total price',
  })
  @ApiBody({ type: CreateWorkOrderPartDto })
  @ApiResponse({
    status: 201,
    description: 'Work order part created successfully',
    schema: {
      example: {
        success: true,
        message: 'Work order part created successfully',
        data: {
          id: 123,
          work_order_id: 1012,
          work_order_service_id: 25,
          part_id: 150,
          quantity: 5,
          unit_price: 125.5,
          total_price: 627.5,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async create(
    @Body() createWorkOrderPartDto: CreateWorkOrderPartDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.workOrderPartsService.create(
      createWorkOrderPartDto,
      Number(req.user.userId),
    );
  }

  // PUT /work-order-parts/:id - Update work order part
  @Put(':id')
  @PermissionCheck('work_orders', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order_parts', recordIdKey: 'id' })
  @ApiOperation({
    summary: 'Update work order part',
    description: 'Update work order part with auto-recalculated total price',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order part ID' })
  @ApiBody({ type: UpdateWorkOrderPartDto })
  @ApiResponse({
    status: 200,
    description: 'Work order part updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Work order part updated successfully',
        data: {
          id: 123,
          work_order_id: 1012,
          work_order_service_id: 25,
          part_id: 150,
          quantity: 7,
          unit_price: 125.5,
          total_price: 878.5,
          updated_at: '2025-07-29T16:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 404, description: 'Work order part not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkOrderPartDto: UpdateWorkOrderPartDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.workOrderPartsService.update(
      id,
      updateWorkOrderPartDto,
      Number(req.user.userId),
    );
  }

  // PATCH /work-order-parts/:id - Partial update work order part
  @Patch(':id')
  @PermissionCheck('work_orders', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'work_order_parts', recordIdKey: 'id' })
  @ApiOperation({
    summary: 'Partial update of work order part (PATCH)',
    description:
      'Update specific fields of a work order part without affecting others',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order part ID' })
  @ApiBody({ type: PatchWorkOrderPartDto })
  @ApiResponse({
    status: 200,
    description: 'Work order part partially updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Work order part partially updated successfully',
        data: {
          id: 123,
          work_order_id: 1012,
          work_order_service_id: 25,
          part_id: 150,
          quantity: 7,
          unit_price: 125.5,
          total_price: 878.5,
          updated_at: '2025-07-29T16:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 404, description: 'Work order part not found' })
  async partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() partialUpdateDto: Partial<PatchWorkOrderPartDto>,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    return await this.workOrderPartsService.partialUpdate(
      id,
      partialUpdateDto,
      userId,
    );
  }

  // DELETE /work-order-parts/:id - Delete work order part
  @Delete(':id')
  @PermissionCheck('work_orders', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'Delete work order part',
    description: 'Delete work order part by ID',
  })
  @ApiParam({ name: 'id', type: 'number', description: 'Work order part ID' })
  @ApiResponse({
    status: 200,
    description: 'Work order part deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'Work order part deleted successfully',
        data: {
          id: 123,
          total_price: 878.5,
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Work order part not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.workOrderPartsService.remove(id);
  }
}
