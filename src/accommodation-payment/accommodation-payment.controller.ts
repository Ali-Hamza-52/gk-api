// src/accommodation-payment/accommodation-payment.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AccommodationPaymentService } from './accommodation-payment.service';
import { CreateAccommodationPaymentDto } from './dto/create-accommodation-payment.dto';
import { UpdateAccommodationPaymentDto } from './dto/update-accommodation-payment.dto';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';
import { UserThrottlerGuard } from '@/common/guards/user-throttler.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Accommodation Payment')
@Controller('accommodation-payments')
export class AccommodationPaymentController {
  constructor(private readonly service: AccommodationPaymentService) {}

  @Post()
  @UseGuards(UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @UseInterceptors(AnyFilesInterceptor(), RequestLogInterceptor)
  @RequestLog({ module: 'accommodation_payment', recordIdKey: 'id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAccommodationPaymentDto })
  @ApiOperation({ summary: 'Create accommodation payment' })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateAccommodationPaymentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const userId = Number(req.user.userId);
    return this.service.create(dto, files, userId);
  }

  @Get()
  @ApiOperation({ summary: 'List all accommodation payments with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  async findAll(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    return this.service.findAll(+page, +perPage);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  async findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Put(':id')
  @UseGuards(UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @UseInterceptors(AnyFilesInterceptor(), RequestLogInterceptor)
  @RequestLog({ module: 'accommodation_payment', recordIdKey: 'id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAccommodationPaymentDto })
  @ApiOperation({ summary: 'Update accommodation payment' })
  async update(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateAccommodationPaymentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const userId = Number(req.user.userId);
    return this.service.update(+id, dto, files, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete accommodation payment' })
  async remove(@Param('id') id: number) {
    return this.service.remove(+id);
  }
}
