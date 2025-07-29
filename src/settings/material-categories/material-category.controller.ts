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
import { MaterialCategoryService } from './material-category.service';
import { CreateMaterialCategoryDto } from './dto/create-material-category.dto';
import { UpdateMaterialCategoryDto } from './dto/update-material-category.dto';
import { FilterMaterialCategoryDto } from './dto/filter-material-category.dto';
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

@ApiTags('Material Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings/material-categories')
export class MaterialCategoryController {
  constructor(private readonly service: MaterialCategoryService) {}

  @Post()
  @PermissionCheck('settings', 'C')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create material category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  create(
    @Body() dto: CreateMaterialCategoryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.create(dto, req.user.userId);
  }

  @Patch(':id')
  @PermissionCheck('settings', 'E')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update material category' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  update(
    @Param('id') id: number,
    @Body() dto: UpdateMaterialCategoryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @PermissionCheck('settings', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete material category' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }

  @Get(':id')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get material category detail' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Category fetched successfully' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Get()
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get all material categories (paginated)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'searchTerm', required: false })
  @ApiResponse({ status: 200, description: 'Categories fetched successfully' })
  findAll(@Query() filter: FilterMaterialCategoryDto) {
    return this.service.findAll(filter);
  }

  @Get('/options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get dropdown list of categories' })
  @ApiResponse({ status: 200, description: 'Dropdown fetched successfully' })
  dropdown() {
    return this.service.dropdown();
  }
}
