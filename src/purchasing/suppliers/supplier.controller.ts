// src/purchasing/suppliers/supplier.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { SupplierFilterDto } from './entities/filter-supplier.dto';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';
import { UseInterceptors } from '@nestjs/common';

@ApiTags('Suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Get supplier summary (total suppliers, incomplete VAT)',
  })
  @ApiOkResponse({
    description: 'Summary stats for suppliers',
    schema: {
      example: {
        success: true,
        message: 'Supplier summary fetched',
        data: {
          totalRows: 88,
          inCompleteVat: 12,
        },
      },
    },
  })
  async getSupplierSummary() {
    return this.supplierService.getSupplierSummary();
  }

  @Get('/options')
  @ApiOperation({ summary: 'Get dropdown list of suppliers (id + name)' })
  @ApiOkResponse({
    description: 'Dropdown list of suppliers',
    schema: {
      example: {
        success: true,
        message: 'Supplier dropdown fetched',
        data: [
          { id: 1, name: 'Supplier A' },
          { id: 2, name: 'Supplier B' },
        ],
      },
    },
  })
  async getDropdown() {
    return this.supplierService.getDropdown();
  }

  @Post()
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'supplier', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiResponse({ status: 201, description: 'Supplier created successfully.' })
  async create(
    @Body() dto: CreateSupplierDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.supplierService.create(dto, req.user.userId);
  }

  @Put(':id')
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'supplier', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update supplier by ID' })
  @ApiResponse({ status: 200, description: 'Supplier updated successfully.' })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateSupplierDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.supplierService.update(id, dto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'List suppliers with pagination and filters' })
  @ApiOkResponse({
    description: 'Suppliers fetched successfully',
    schema: {
      example: {
        success: true,
        message: 'Suppliers fetched successfully',
        data: {
          data: [
            /* paginated suppliers */
          ],
          total: 10,
          currentPage: 1,
          perPage: 15,
          totalPages: 1,
        },
      },
    },
  })
  async findAll(@Query() filterDto: SupplierFilterDto) {
    return this.supplierService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supplier by ID' })
  @ApiResponse({ status: 200, description: 'Supplier fetched successfully.' })
  async findOne(@Param('id') id: number) {
    return this.supplierService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete supplier by ID' })
  @ApiResponse({ status: 200, description: 'Supplier deleted successfully.' })
  async delete(@Param('id') id: number, @Req() req: AuthenticatedRequest) {
    return this.supplierService.delete(id, req.user.userId);
  }

  // --- Supplier Types ---

  @Post('/types')
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'supplier_type', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create a new supplier type' })
  async createType(
    @Body('type') type: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.supplierService.createType(type, req.user.userId);
  }

  @Get('/types/all')
  @ApiOperation({ summary: 'Get all supplier types' })
  @ApiQuery({ name: 'search', required: false })
  async getAllTypes(@Query('search') search: string) {
    return this.supplierService.findAllTypes(search);
  }

  @Put('/types/:id')
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'supplier_type', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update supplier type by ID' })
  async updateType(
    @Param('id') id: number,
    @Body('type') type: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.supplierService.updateType(id, type, req.user.userId);
  }

  @Delete('/types/:id')
  @ApiOperation({ summary: 'Delete supplier type by ID' })
  async deleteType(@Param('id') id: number, @Req() req: AuthenticatedRequest) {
    return this.supplierService.deleteType(id, req.user.userId);
  }
}
