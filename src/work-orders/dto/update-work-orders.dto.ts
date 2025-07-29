import { PartialType } from '@nestjs/swagger';
import { CreateWorkOrderDto } from './create-work-orders.dto';

export class UpdateWorkOrderDto extends PartialType(CreateWorkOrderDto) {}
