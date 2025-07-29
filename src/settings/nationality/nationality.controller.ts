import { Controller, Get, UseGuards } from '@nestjs/common';
import { NationalityService } from './nationality.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings/nationalities')
export class NationalityController {
  constructor(private readonly service: NationalityService) {}

  @Get('options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Dropdown list for Nationalities' })
  dropdown() {
    return this.service.dropdown();
  }
}
