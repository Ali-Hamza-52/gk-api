import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsDateString,
  Length,
  Min,
  Max,
} from 'class-validator';
import {
  WorkOrderStatus,
  WorkOrderPriority,
} from '../entities/work-orders.entity';

export class CreateWorkOrderDto {
  @ApiProperty({
    example: 'WO-2025-0001',
    description: 'Work Order Code',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  work_order_code?: string;

  @ApiProperty({ example: 1054, description: 'Client ID' })
  @IsNumber()
  client_id: number;

  @ApiProperty({ example: 442, description: 'Client Location ID' })
  @IsNumber()
  location_id: number;

  @ApiProperty({
    example: 0,
    description: 'Request Type: 0 = Open, 1 = Service Task',
  })
  @IsNumber()
  request_type: number;

  @ApiProperty({ example: 442, description: 'Contract ID' })
  @IsOptional()
  @IsNumber()
  contract_id?: number;

  @ApiProperty({
    enum: WorkOrderPriority,
    example: WorkOrderPriority.CRITICAL,
    description: '1-Critical, 2-High, 3-Medium, 4-Low, 5-Routine',
  })
  @IsEnum(WorkOrderPriority)
  priority: WorkOrderPriority;

  @ApiProperty({ example: 'Salman Arif', description: 'Contact Person Name' })
  @IsString()
  @Length(1, 100)
  contact_person: string;

  @ApiProperty({
    example: '+966501234567',
    description: 'Contact Phone Number',
  })
  @IsString()
  @Length(1, 50)
  contact_number: string;

  @ApiProperty({
    example: 15,
    description: 'User ID who requested the work order',
  })
  @IsNumber()
  requested_by: number;

  @ApiProperty({
    enum: WorkOrderStatus,
    example: WorkOrderStatus.REQUESTED,
    description: 'Current status of the work order',
    required: false,
  })
  @IsEnum(WorkOrderStatus)
  status?: WorkOrderStatus;

  @ApiProperty({
    example: 25,
    description: 'Assigned Technician User ID',
    required: false,
  })
  @IsNumber()
  assigned_technician?: number;

  @ApiProperty({
    example: '2025-07-14T11:00:00Z',
    description: 'Diagnosis timestamp',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  diagnosis_timestamp?: string;

  @ApiProperty({
    example: '2025-07-14T17:00:00Z',
    description: 'SLA deadline timestamp',
  })
  @IsOptional()
  @IsDateString()
  sla_due_at?: string;

  @ApiProperty({
    example: '2025-07-14T15:00:00Z',
    description: 'Completion timestamp',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  completed_at?: string;

  @ApiProperty({
    example: 4,
    description: 'Feedback rating (1-5)',
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  feedback_rating?: number;

  @ApiProperty({
    example: 'Technicians were responsive.',
    description: 'Feedback comments',
    required: false,
  })
  @IsOptional()
  @IsString()
  feedback_comments?: string;

  @ApiProperty({
    example: false,
    description: 'Whether this work order was reopened as warranty',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  reopened_as_warranty?: boolean;
}
