import { Controller, Get, UseGuards } from '@nestjs/common';
import { CityService } from './city.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings/cities')
export class CityController {
  constructor(private readonly service: CityService) {}

  @Get('options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Dropdown list for Cities' })
  dropdown() {
    return this.service.dropdown();
  }
}
