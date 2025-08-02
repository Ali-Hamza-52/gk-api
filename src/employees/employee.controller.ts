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
  UseGuards,
  UseInterceptors,
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
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { FilterEmployeeDto } from './dto/filter-employee.dto';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { UserThrottlerGuard } from '@/common/guards/user-throttler.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Employee')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @PermissionCheck('employees', 'C')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @SkipThrottle()
  @UseInterceptors(AnyFilesInterceptor(), RequestLogInterceptor)
  @RequestLog({ module: 'employee', recordIdKey: 'emp_id' })
  @ApiOperation({ summary: 'Create new employee' })
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() dto: CreateEmployeeDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthenticatedRequest,
  ) {
    return this.employeeService.create(dto, files, Number(req.user.userId));
  }

  @Get('summary')
  @ApiOperation({
    summary:
      'Get employee summary (deployed, expired and expiring soon iqamas)',
  })
  @ApiOkResponse({
    description: 'Returns a summary of deployed employees and iqama statuses',
    schema: {
      example: {
        success: true,
        message: 'Employee summary fetched successfully.',
        data: {
          totalDeployed: 55,
          totalExpireIqama: 12,
          totalExpiringSoon: 9,
        },
      },
    },
  })
  async getEmployeeSummary() {
    return this.employeeService.getEmployeeSummary();
  }

  @Get('service-provider/summary')
  @ApiOperation({
    summary:
      'Get service provider summary (deployed, available, expired iqamas)',
  })
  @ApiOkResponse({
    description: 'Returns summary of service providers',
    schema: {
      example: {
        success: true,
        message: 'Service provider summary fetched successfully.',
        data: {
          totalDeployed: 18,
          totalAvailable: 6,
          totalExpireIqama: 3,
        },
      },
    },
  })
  async getServiceProviderSummary() {
    return this.employeeService.getServiceProviderSummary();
  }

  @Get()
  @PermissionCheck('employees', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'List employees with filter & pagination' })
  async findAll(
    @Query() filterDto: FilterEmployeeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    const roleId = Number(req.user.role);
    return this.employeeService.findAll(filterDto, false, userId, roleId);
  }

  @Get(':id')
  @PermissionCheck('employees', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get employee by ID' })
  async findOne(@Param('id') id: number) {
    return this.employeeService.findOne(id);
  }

  @Put(':id')
  @PermissionCheck('employees', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @SkipThrottle()
  @UseInterceptors(AnyFilesInterceptor(), RequestLogInterceptor)
  @RequestLog({ module: 'employee', recordIdKey: 'emp_id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiOperation({ summary: 'Update employee' })
  async update(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateEmployeeDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.employeeService.update(id, dto, files, Number(req.user.userId));
  }

  @Delete(':id')
  @PermissionCheck('employees', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete employee' })
  async remove(@Param('id') id: number) {
    return this.employeeService.remove(id);
  }

  // Service Provider-specific endpoints

  @Post('service-provider')
  @UseInterceptors(AnyFilesInterceptor(), RequestLogInterceptor)
  @RequestLog({ module: 'employee', recordIdKey: 'emp_id' })
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Add a new service provider' })
  async addServiceProvider(
    @Body() dto: CreateEmployeeDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthenticatedRequest,
  ) {
    return this.employeeService.create(dto, [], Number(req.user.userId), true);
  }

  @Delete('service-provider/:id')
  @ApiOperation({ summary: 'Delete a service provider' })
  async deleteServiceProvider(@Param('id') id: number) {
    return this.employeeService.remove(id);
  }

  @Get('service-provider/list')
  @PermissionCheck('employees', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'List service providers' })
  async listServiceProviders(
    @Query() filterDto: FilterEmployeeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    const roleId = Number(req.user.role);
    return this.employeeService.findAll(filterDto, true, userId, roleId);
  }
}
