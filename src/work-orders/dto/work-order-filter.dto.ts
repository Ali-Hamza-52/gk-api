import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsBoolean,
  IsIn,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  WorkOrderPriority,
  WorkOrderStatus,
} from '../entities/work-orders.entity';

export class WorkOrderFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by request type: 0 = Open, 1 = Service Task',
  })
  @IsOptional()
  @IsIn([0, 1])
  request_type?: number;

  @ApiPropertyOptional({
    enum: WorkOrderPriority,
    description: 'Filter by work order priority',
  })
  @IsOptional()
  @IsEnum(WorkOrderPriority)
  priority?: WorkOrderPriority;

  @ApiPropertyOptional({
    enum: WorkOrderStatus,
    description: 'Filter by work order status',
  })
  @IsOptional()
  @IsEnum(WorkOrderStatus)
  status?: WorkOrderStatus;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter by warranty reopening status',
  })
  @IsOptional()
  @IsBoolean()
  reopened_as_warranty?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of items per page',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  perPage?: number;

  @ApiPropertyOptional({
    description: 'Search term for filtering work orders',
  })
  @IsOptional()
  @IsString()
  searchTerm?: string;
}
