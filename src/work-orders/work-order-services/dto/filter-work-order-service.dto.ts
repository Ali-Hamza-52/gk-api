import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../entities/work-order-service.entity';

export class FilterWorkOrderServiceDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  perPage?: number;

  @ApiPropertyOptional({
    description: 'Search by ID, work order ID, or service name',
  })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({
    description: 'Filter by work order ID',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  work_order_id?: number;

  @ApiPropertyOptional({ description: 'Filter by service ID' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  service_id_link?: number;

  @ApiPropertyOptional({
    enum: TaskStatus,
    description: 'Filter by task status',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  task_status?: TaskStatus;

  // @ApiPropertyOptional({
  //   example: false,
  //   description: 'Filter by client approval status',
  // })
  // @IsOptional()
  // @Type(() => Boolean)
  // @IsBoolean()
  // approved_by_client?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by approver user ID',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  approved_by_userid?: number;
}
