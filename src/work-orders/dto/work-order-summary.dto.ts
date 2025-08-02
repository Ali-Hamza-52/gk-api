// src/work-orders/dto/work-order-summary.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsInt, IsPositive } from 'class-validator';

export class WorkOrderSummaryDto {
  @ApiPropertyOptional({
    description: 'Filter summary by specific client ID (optional)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Client ID must be a number' })
  @IsInt({ message: 'Client ID must be an integer' })
  @IsPositive({ message: 'Client ID must be positive' })
  client_id?: number;
}
