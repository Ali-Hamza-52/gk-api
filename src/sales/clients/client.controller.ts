import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { MulterFile } from './types/multer-file.type';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { SwaggerTransformPipe } from 'src/common/pipes/swagger-transform.pipe';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { UserThrottlerGuard } from '@/common/guards/user-throttler.guard';
import { RequestLog } from '@/common/decorators/request-log.decorator';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Clients')
@Controller('clients')
export class ClientController {
  constructor(private svc: ClientService) {}

  @Get()
  @PermissionCheck('client', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'List all clients with optional pagination and search',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'searchTerm', required: false, type: String })
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
    @Query('searchTerm') searchTerm?: string,
  ) {
    const userId = Number(req.user.userId);
    const role = Number(req.user.role);
    return this.svc.getAll({ page, perPage, searchTerm, userId, role });
  }

  @Get('options')
  @ApiOperation({ summary: 'Dropdown options for clients (code + name)' })
  getDropdownOptions() {
    return this.svc.getDropdownOptions().then((data) => ({
      message: 'Clients fetched',
      success: true,
      data,
    }));
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Get summary of clients (Active, Expired, under-signing)',
  })
  async getClientSummary() {
    return this.svc.getClientSummary();
  }

  @Get('locations')
  @ApiOperation({ summary: 'Get locations of a client by client_code' })
  @ApiQuery({ name: 'client_code', required: true, type: Number })
  async getClientLocations(@Query('client_code') client_code: number) {
    return this.svc.getClientLocationsByClientCode(client_code);
  }

  @Post()
  @PermissionCheck('client', 'C')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @Throttle({ default: { limit: 30, ttl: 3600000 } })
  @UseInterceptors(AnyFilesInterceptor(), RequestLogInterceptor)
  @RequestLog({ module: 'clients', recordIdKey: 'client_code' })
  @ApiOperation({ summary: 'Create a client' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateClientDto })
  @UsePipes(SwaggerTransformPipe)
  async create(
    @Body() dto: CreateClientDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFiles() files?: Record<string, MulterFile[]>,
  ) {
    const userId = Number(req.user.userId);
    const data = await this.svc.create(dto, files, userId);
    return data;
  }

  @Get(':code')
  @PermissionCheck('client', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get client detail' })
  @ApiParam({ name: 'code', type: Number })
  @ApiResponse({ status: 200, description: 'Detail returned' })
  getDetail(@Param('code') code: string) {
    return this.svc.getDetail(+code);
  }

  @Put(':code')
  @PermissionCheck('client', 'E')
  @UseGuards(PermissionGuard)
  @UseInterceptors(AnyFilesInterceptor(), RequestLogInterceptor)
  @RequestLog({ module: 'clients', recordIdKey: 'client_code' })
  @ApiOperation({ summary: 'Update client' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateClientDto })
  @UsePipes(SwaggerTransformPipe)
  async update(
    @Param('code') code: string,
    @Body() updateClientDto: UpdateClientDto,
    @Req() req: AuthenticatedRequest,
    @UploadedFiles() files?: Record<string, MulterFile[]>,
  ) {
    const userId = Number(req.user.userId);
    const result = await this.svc.update(+code, updateClientDto, files, userId);
    return result;
  }

  @Delete(':code')
  @PermissionCheck('client', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete client' })
  @ApiParam({ name: 'code', type: Number })
  @ApiResponse({ status: 200, description: 'Deleted' })
  delete(@Param('code') code: string) {
    return this.svc.delete(+code);
  }
}
