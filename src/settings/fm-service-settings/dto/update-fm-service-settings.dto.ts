import { PartialType } from '@nestjs/swagger';
import { CreateFmServiceSettingsDto } from './create-fm-service-settings.dto';

export class UpdateFmServiceSettingsDto extends PartialType(
  CreateFmServiceSettingsDto,
) {}
