import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { ClientPricingRulesService } from './client-pricing-rules.service';
import { CreateClientPricingRuleDto } from './dto/create-client-pricing-rule.dto';
import { UpdateClientPricingRuleDto } from './dto/update-client-pricing-rule.dto';
import { FilterClientPricingRuleDto } from './dto/filter-client-pricing-rule.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { UserThrottlerGuard } from '@/common/guards/user-throttler.guard';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';
import { UseInterceptors } from '@nestjs/common';

@ApiTags('Client Pricing Rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('client-pricing-rules')
export class ClientPricingRulesController {
  constructor(private readonly service: ClientPricingRulesService) {}

  @Get('options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary:
      'Get dropdown options for client pricing rules (ID/Client Code-Name)',
  })
  @ApiOkResponse({
    description: 'Dropdown options for clients',
    schema: {
      example: {
        success: true,
        message: 'Dropdown options fetched successfully',
        data: [
          { value: 1, text: 'CLI001 - ABC Company' },
          { value: 2, text: 'CLI002 - XYZ Corporation' },
        ],
      },
    },
  })
  async getDropdownOptions() {
    return this.service.getDropdownOptions();
  }

  @Get('summary')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get pricing rules summary statistics' })
  @ApiOkResponse({
    description: 'Summary statistics for client pricing rules',
    schema: {
      example: {
        success: true,
        message: 'Summary fetched successfully',
        data: {
          totalPricingRules: 25,
          totalDiscounts: 15,
          totalMarkups: 10,
        },
      },
    },
  })
  async getSummary() {
    return this.service.getSummary();
  }

  @Post()
  @PermissionCheck('settings', 'C')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @SkipThrottle()
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'client_pricing_rules', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create a new client pricing rule' })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateClientPricingRuleDto,
  ) {
    const userId = Number(req.user.userId);
    return this.service.create(dto, userId);
  }

  @Get()
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({
    summary: 'List client pricing rules with pagination and search',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, example: 10 })
  @ApiQuery({
    name: 'searchTerm',
    required: false,
    description: 'Search by ID or client name',
  })
  @ApiQuery({
    name: 'clientCode',
    required: false,
    description: 'Filter by client code',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by service category',
  })
  @ApiQuery({
    name: 'pricingType',
    required: false,
    description: 'Filter by pricing type (discount/markup)',
  })
  async findAll(
    @Query() filterDto: FilterClientPricingRuleDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.userId);
    const roleId = Number(req.user.role);
    return this.service.findAll({ ...filterDto, userId, roleId });
  }

  @Get(':id')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get client pricing rule by ID' })
  @ApiParam({ name: 'id', description: 'Client pricing rule ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @PermissionCheck('settings', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @SkipThrottle()
  @UseInterceptors(RequestLogInterceptor)
  @ApiOperation({ summary: 'Update client pricing rule completely' })
  @ApiParam({ name: 'id', description: 'Client pricing rule ID' })
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClientPricingRuleDto,
  ) {
    const userId = Number(req.user.userId);
    return this.service.update(id, dto, userId);
  }

  @Delete(':id')
  @PermissionCheck('settings', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete client pricing rule by ID' })
  @ApiParam({ name: 'id', description: 'Client pricing rule ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Patch(':id')
  @PermissionCheck('settings', 'E')
  @UseGuards(PermissionGuard, UserThrottlerGuard)
  @SkipThrottle()
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'client_pricing_rules', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Partially update client pricing rule' })
  @ApiParam({ name: 'id', description: 'Client pricing rule ID' })
  @ApiBody({
    type: UpdateClientPricingRuleDto,
    description: 'Fields to update (all fields are optional for PATCH)',
    required: true,
  })
  async partialUpdate(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<UpdateClientPricingRuleDto>,
  ) {
    const userId = Number(req.user.userId);
    return this.service.partialUpdate(id, dto, userId);
  }
}
