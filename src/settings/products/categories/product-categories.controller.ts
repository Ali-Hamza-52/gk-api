// src/products/categories/product-categories.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { FilterProductCategoryDto } from './dto/filter-product-category.dto';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { UserThrottlerGuard } from '@/common/guards/user-throttler.guard';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';

@ApiTags('Products / Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings/products/categories')
export class ProductCategoriesController {
  constructor(private readonly svc: ProductCategoriesService) {}

  @Post()
  @PermissionCheck('settings', 'C')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @UseInterceptors(FileInterceptor('icon'), RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Add a category' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductCategoryDto })
  create(
    @Body() dto: CreateProductCategoryDto,
    @UploadedFile() icon: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.svc.create(dto, icon, Number(req.user.userId));
  }

  @Get()
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'List categories (paginated)' })
  findAll(@Query() filter: FilterProductCategoryDto) {
    return this.svc.findAll(filter);
  }

  @Get('dropdown')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Dropdown list' })
  dropdown() {
    return this.svc.dropdown();
  }

  @Get(':id')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get category by ID' })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(Number(id));
  }

  @Put(':id')
  @PermissionCheck('settings', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @ApiOperation({ summary: 'Update category' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProductCategoryDto })
  @UseInterceptors(FileInterceptor('icon'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductCategoryDto,
    @UploadedFile() icon: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.svc.update(Number(id), dto, icon, Number(req.user.userId));
  }

  @Delete(':id')
  @PermissionCheck('settings', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete category' })
  remove(@Param('id') id: string) {
    return this.svc.remove(Number(id));
  }
}
