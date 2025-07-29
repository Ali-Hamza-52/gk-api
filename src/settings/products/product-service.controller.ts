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
import { ProductService } from './product-service.service';
import { CreateProductServiceDto } from './dto/create-product-service.dto';
import { UpdateProductServiceDto } from './dto/update-product-service.dto';
import { FilterProductServiceDto } from './dto/filter-product-service.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';

@ApiTags('Products')
@Controller('settings/products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProductServiceController {
  constructor(private readonly service: ProductService) {}

  @Post()
  @PermissionCheck('settings', 'C')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create a new product or service' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  create(
    @Body() dto: CreateProductServiceDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.create(dto, req.user.userId);
  }

  @Get('/summary')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get product summary (e.g., total count)' })
  @ApiResponse({ status: 200, description: 'Summary fetched successfully' })
  summary() {
    return this.service.summary();
  }

  @Get('/options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get dropdown list of all products/services' })
  @ApiResponse({ status: 200, description: 'Dropdown fetched successfully' })
  dropdown() {
    return this.service.dropdown();
  }

  @Patch(':id')
  @PermissionCheck('settings', 'E')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Update a product or service' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  update(
    @Param('id') id: number,
    @Body() dto: UpdateProductServiceDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.update(id, dto, req.user.userId);
  }

  @Get(':id')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get product or service by ID' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Product fetched successfully' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @PermissionCheck('settings', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete a product or service by ID' })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }

  @Get()
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get paginated list of products/services' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'searchTerm', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Products fetched successfully' })
  findAll(@Query() filter: FilterProductServiceDto) {
    return this.service.findAll(filter);
  }
}
