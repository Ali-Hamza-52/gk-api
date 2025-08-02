// src/accommodation-bill-payment/accommodation-bill-payment.controller.ts

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
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserThrottlerGuard } from 'src/common/guards/user-throttler.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { AccommodationBillPaymentService } from './accommodation-bill-payment.service';
import { CreateAccommodationBillPaymentDto } from './dto/create-accommodation-bill-payment.dto';
import { UpdateAccommodationBillPaymentDto } from './dto/update-accommodation-bill-payment.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Accommodation Bill Payments')
@Controller('accommodation-bill-payments')
export class AccommodationBillPaymentController {
  constructor(private readonly svc: AccommodationBillPaymentService) {}

  @Post()
  @UseGuards(UserThrottlerGuard)
  @SkipThrottle()
  @UseInterceptors(AnyFilesInterceptor(), RequestLogInterceptor)
  @RequestLog({ module: 'accommodation_bill_payment', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create a new accommodation bill payment' })
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() dto: CreateAccommodationBillPaymentDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthenticatedRequest,
  ) {
    return this.svc.create(dto, files, Number(req.user.userId));
  }

  @Get()
  @ApiOperation({
    summary:
      'List all accommodation bill payments (optional: filter by accommodation_base_id)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'accommodation_base_id', required: false, type: Number })
  async findAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('accommodation_base_id') accommodation_base_id?: number,
  ) {
    return this.svc.findAll(+page, +perPage, accommodation_base_id);
  }

  @Get('summary')
  @ApiOperation({
    summary:
      'Get summary of accommodation bill payments by accommodation_base_id',
  })
  @ApiQuery({
    name: 'accommodation_base_id',
    required: true,
    type: Number,
    example: 12,
  })
  async getSummary(
    @Query('accommodation_base_id') accommodation_base_id: number,
  ) {
    return this.svc.getSummary(+accommodation_base_id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details of a single accommodation bill payment',
  })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id') id: string) {
    return this.svc.findOne(+id);
  }

  @Put(':id')
  @UseGuards(UserThrottlerGuard)
  @SkipThrottle()
  @UseInterceptors(AnyFilesInterceptor(), RequestLogInterceptor)
  @RequestLog({ module: 'accommodation_bill_payment', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update an accommodation bill payment' })
  @ApiConsumes('multipart/form-data') // Use this to support any file field, including 'attachment'
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAccommodationBillPaymentDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthenticatedRequest,
  ) {
    return this.svc.update(+id, dto, files, Number(req.user.userId));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an accommodation bill payment' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }
}
