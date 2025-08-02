import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsInt,
  IsPositive,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { TaskStatus } from '../entities/work-order-service.entity';

export class CreateWorkOrderServiceDto {
  @ApiProperty({
    example: 1012,
    description: 'Work Order ID from work_orders table',
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  work_order_id: number;

  @ApiProperty({
    example: 5,
    description: 'Service ID from fm_service_settings table',
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  service_id_link: number;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.REQUESTED,
    description: 'Task status (defaults to Requested if not provided)',
    default: TaskStatus.REQUESTED,
  })
  @IsEnum(TaskStatus)
  task_status: TaskStatus;

  @ApiPropertyOptional({
    example: false,
    description: 'Client approval status (defaults to false, not editable)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  approved_by_client?: boolean;

  @ApiPropertyOptional({
    example: 101,
    description: 'User ID who approved the service',
  })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @IsPositive()
  approved_by_userid?: number;

  @ApiPropertyOptional({
    example: '2025-07-14T12:00:00Z',
    description: 'Approval timestamp (hidden field)',
  })
  @IsOptional()
  @IsDateString()
  approved_date?: string;
}
