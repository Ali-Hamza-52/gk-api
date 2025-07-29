import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';

@ApiTags('Settings - Skills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings/skills')
export class SkillsController {
  constructor(private readonly service: SkillsService) {}

  @Post()
  @PermissionCheck('settings', 'C')
  @UseGuards(PermissionGuard)
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'settings', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ status: 201, description: 'Skill created successfully' })
  async create(@Body() dto: CreateSkillDto, @Req() req: AuthenticatedRequest) {
    return this.service.create(dto, req.user.userId);
  }

  @Get('/options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get skill dropdown (value & text)' })
  async getDropdown() {
    return this.service.getDropdown();
  }

  @Put(':id')
  @PermissionCheck('settings', 'E')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Update skill by ID' })
  @ApiResponse({ status: 200, description: 'Skill updated successfully' })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateSkillDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.update(id, dto, req.user.userId);
  }

  @Get()
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'List skills with pagination and search' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'searchTerm', required: false, type: String })
  async findAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('searchTerm') searchTerm?: string,
  ) {
    return this.service.findAll({ page, perPage, searchTerm });
  }

  @Get(':id')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get skill by ID' })
  @ApiResponse({ status: 200, description: 'Skill fetched successfully' })
  async findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @PermissionCheck('settings', 'D')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Delete skill by ID' })
  @ApiResponse({ status: 200, description: 'Skill deleted successfully' })
  async delete(@Param('id') id: number, @Req() req: AuthenticatedRequest) {
    return this.service.delete(id, req.user.userId);
  }

  @Get('/summary')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Get skills summary (total count)' })
  @ApiOkResponse({
    description: 'Skills summary fetched',
    schema: {
      example: {
        success: true,
        message: 'Skills summary fetched',
        data: { totalRows: 18 },
      },
    },
  })
  async getSummary() {
    return this.service.getSummary();
  }
}
