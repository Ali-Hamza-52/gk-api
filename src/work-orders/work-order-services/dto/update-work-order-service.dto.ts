import { PartialType } from '@nestjs/swagger';
import { CreateWorkOrderServiceDto } from './create-work-order-service.dto';

export class UpdateWorkOrderServiceDto extends PartialType(
  CreateWorkOrderServiceDto,
) {}

export class PatchWorkOrderServiceDto extends PartialType(
  CreateWorkOrderServiceDto,
) {}
