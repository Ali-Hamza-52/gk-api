import { Controller, Get, UseGuards } from '@nestjs/common';
import { BankService } from './bank.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionCheck } from '@/common/decorators/permission-check.decorator';
import { PermissionGuard } from '@/common/guards/permission.guard';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings/banks')
export class BankController {
  constructor(private readonly service: BankService) {}

  @Get('options')
  @PermissionCheck('settings', 'V')
  @UseGuards(PermissionGuard)
  @ApiOperation({ summary: 'Dropdown list for Banks' })
  dropdown() {
    return this.service.dropdown();
  }
}
