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
import { ProfessionService } from './profession.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { FilterProfessionDto } from './dto/filter-profession.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { AuthenticatedRequest } from '@/common/types/authenticated-request';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';

@ApiTags('Settings - Professions')
@Controller('settings/professions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProfessionController {
  constructor(private readonly service: ProfessionService) {}

  @Post()
  @PermissionCheck('settings', 'C')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create a new profession' })
  @ApiResponse({ status: 201, description: 'Profession created successfully' })
  create(@Body() dto: CreateProfessionDto, @Req() req: AuthenticatedRequest) {
    return this.service.create(dto, Number(req.user.userId));
  }

  @Get('/options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get dropdown list of professions' })
  @ApiResponse({ status: 200, description: 'Dropdown fetched successfully' })
  dropdown() {
    return this.service.dropdown();
  }

  @Patch(':profession_en')
  @PermissionCheck('settings', 'E')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Update a profession by profession_en' })
  @ApiParam({ name: 'profession_en', type: String })
  @ApiResponse({ status: 200, description: 'Profession updated successfully' })
  update(
    @Param('profession_en') profession_en: string,
    @Body() dto: UpdateProfessionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.update(profession_en, dto, Number(req.user.userId));
  }

  @Get(':profession_en')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get a profession by profession_en' })
  @ApiParam({ name: 'profession_en', type: String })
  @ApiResponse({ status: 200, description: 'Profession fetched successfully' })
  findOne(@Param('profession_en') profession_en: string) {
    return this.service.findOne(profession_en);
  }

  @Delete(':profession_en')
  @PermissionCheck('settings', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete a profession by profession_en' })
  @ApiParam({ name: 'profession_en', type: String })
  @ApiResponse({ status: 200, description: 'Profession deleted successfully' })
  delete(@Param('profession_en') profession_en: string) {
    return this.service.delete(profession_en);
  }

  @Get()
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get list of professions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'searchTerm', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Professions fetched successfully' })
  findAll(@Query() filter: FilterProfessionDto) {
    return this.service.findAll(filter);
  }
}
