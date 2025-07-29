// src/accommodation/accommodation.controller.ts

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
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AccommodationService } from './accommodation.service';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { UserThrottlerGuard } from '@/common/guards/user-throttler.guard';
import { FilterAccommodationDto } from './dto/filter-accommodation.dto';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';

@ApiTags('Accommodation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accommodation')
export class AccommodationController {
  constructor(private readonly service: AccommodationService) {}

  @Get('options')
  @PermissionCheck('accommodation', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Dropdown options for accommodations (value/text)' })
  async getDropdownOptions() {
    const data = await this.service.getDropdownOptions();
    return {
      message: 'Accommodations fetched',
      success: true,
      data,
    };
  }

  @Get('summary')
  @PermissionCheck('accommodation', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'Get accommodation summary (open, upcoming, past due, total)',
  })
  @ApiOkResponse({
    description: 'Summary statistics for accommodations',
    schema: {
      example: {
        success: true,
        message: 'Accommodation summary fetched successfully.',
        data: {
          totalOpen: 18,
          upcomingCount: 4,
          totalRealEstate: 42,
          pastCount: 3,
        },
      },
    },
  })
  async getAccommodationSummary() {
    return this.service.getAccommodationSummary();
  }

  @Post()
  @PermissionCheck('accommodation', 'C')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @UseInterceptors(AnyFilesInterceptor(), RequestLogInterceptor)
  @RequestLog({ module: 'accommodation', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create a new accommodation' })
  @ApiConsumes('multipart/form-data')
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateAccommodationDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const userId = Number(req.user.userId);
    return this.service.create(dto, files, userId);
  }

  @Get()
  @PermissionCheck('accommodation', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'List accommodations with pagination and search' })
  async findAll(
    @Query() filterDto: FilterAccommodationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    const roleId = Number(req.user.role);
    return this.service.findAll({ ...filterDto, userId, roleId });
  }

  @Get(':id')
  @PermissionCheck('accommodation', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get accommodation detail by ID' })
  async findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @PermissionCheck('accommodation', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @UseInterceptors(AnyFilesInterceptor(), RequestLogInterceptor)
  @RequestLog({ module: 'accommodation', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update accommodation' })
  @ApiConsumes('multipart/form-data')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: number,
    @Body() dto: UpdateAccommodationDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const userId = Number(req.user.userId);
    return this.service.update(id, dto, files, userId);
  }

  @Delete(':id')
  @PermissionCheck('accommodation', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete accommodation by ID' })
  async remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
