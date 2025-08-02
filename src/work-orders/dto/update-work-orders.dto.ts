// src/work-orders/dto/update-work-orders.dto.ts

import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateWorkOrderDto } from './create-work-orders.dto';
import {
  IsNumber,
  IsString,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsDateString,
  IsArray,
  Length,
  Min,
  Max,
  Matches,
  IsIn,
  IsInt,
  IsPositive,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  WorkOrderStatus,
  WorkOrderPriority,
  RequestType,
} from '../entities/work-orders.entity';

// Custom validator for update scenarios
@ValidatorConstraint({ name: 'ServicesArrayValidationForUpdate', async: false })
export class ServicesArrayValidationForUpdate
  implements ValidatorConstraintInterface
{
  warningMessage = '';
  validate(services: number[] | undefined, args: any) {
    const object = args.object as UpdateWorkOrderDto;

    // Only validate if request_type is explicitly provided in the update
    if (object.request_type !== undefined) {
      // If request_type is Open (0) and services array is provided, return false (invalid)
      if (object.request_type === RequestType.Open && services !== undefined) {
        this.warningMessage =
          'Services array should not be provided when request_type is Open (0).';
        return false;
      }

      // If request_type is ServiceTask (1) and services is explicitly set to empty, return false (invalid)
      if (
        object.request_type === RequestType.ServiceTask &&
        services !== undefined &&
        services.length === 0
      ) {
        this.warningMessage =
          'At least one service must be provided when request_type is ServiceTask (1).';
        return false;
      }
    }

    return true;
  }

  defaultMessage() {
    return (
      this.warningMessage || 'Invalid services array based on request_type.'
    );
  }
}

export class UpdateWorkOrderDto extends PartialType(CreateWorkOrderDto) {
  @ApiPropertyOptional({
    description: 'Client ID',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Client ID must be a number' })
  @IsInt({ message: 'Client ID must be an integer' })
  @IsPositive({ message: 'Client ID must be positive' })
  client_id?: number;

  @ApiPropertyOptional({
    description: 'Client Location ID',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Location ID must be a number' })
  @IsInt({ message: 'Location ID must be an integer' })
  @IsPositive({ message: 'Location ID must be positive' })
  location_id?: number;

  @ApiPropertyOptional({
    type: 'number',
    enum: [0, 1],
    description: '0 = Open (Diagnostic), 1 = Service Task',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    return Number(value);
  })
  @IsIn([0, 1], {
    message: 'Request type must be one of the following values: 0, 1',
  })
  request_type?: RequestType;

  @ApiPropertyOptional({
    description: 'Contract ID (Optional - not a foreign key constraint)',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Contract ID must be a number' })
  @IsInt({ message: 'Contract ID must be an integer' })
  @IsPositive({ message: 'Contract ID must be positive' })
  contract_id?: number;

  @ApiPropertyOptional({
    type: 'number',
    enum: [1, 2, 3, 4, 5],
    description: '1-Critical, 2-High, 3-Medium, 4-Low, 5-Routine',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    return Number(value);
  })
  @IsIn([1, 2, 3, 4, 5], {
    message: 'Priority must be one of the following values: 1, 2, 3, 4, 5',
  })
  priority?: WorkOrderPriority;

  @ApiPropertyOptional({
    description: 'Contact Person Name',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Contact person must be a string' })
  @Length(1, 100, {
    message: 'Contact person must be between 1 and 100 characters',
  })
  contact_person?: string;

  @ApiPropertyOptional({
    description: 'Contact Phone Number',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Contact number must be a string' })
  @Matches(/^\+[1-9]\d{8,14}$/, {
    message:
      'Phone number must be in international format (+country code + number)',
  })
  @Length(1, 50, {
    message: 'Contact number must be between 1 and 50 characters',
  })
  contact_number?: string;

  @ApiPropertyOptional({
    description: 'User ID who requested the work order',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Requested by must be a number' })
  @IsInt({ message: 'Requested by must be an integer' })
  @IsPositive({ message: 'Requested by must be positive' })
  requested_by?: number;

  @ApiPropertyOptional({
    type: 'string',
    enum: Object.values(WorkOrderStatus),
    description: 'Current status of the work order',
    required: false,
  })
  @IsOptional()
  @IsEnum(WorkOrderStatus, {
    message: `Status must be one of the following values: ${Object.values(WorkOrderStatus).join(', ')}`,
  })
  status?: WorkOrderStatus;

  @ApiPropertyOptional({
    description: 'Assigned Technician User ID',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Assigned technician must be a number' })
  @IsInt({ message: 'Assigned technician must be an integer' })
  @IsPositive({ message: 'Assigned technician must be positive' })
  assigned_technician?: number;

  @ApiPropertyOptional({
    description: 'Diagnosis timestamp',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Diagnosis timestamp must be a valid date string' },
  )
  diagnosis_timestamp?: string;

  @ApiPropertyOptional({
    description: 'Scheduled Date/Time',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Scheduled timestamp must be a valid date string' },
  )
  scheduled_timestamp?: string;

  @ApiPropertyOptional({
    description: 'Scheduled Date',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Scheduled date must be a valid date string' })
  scheduled_date?: string;

  @ApiPropertyOptional({
    description: 'SLA deadline timestamp',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'SLA due timestamp must be a valid date string' },
  )
  sla_due_at?: string;

  @ApiPropertyOptional({
    description: 'Completion timestamp',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Completed timestamp must be a valid date string' },
  )
  completed_at?: string;

  @ApiPropertyOptional({
    description: 'Feedback rating (1-5)',
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Feedback rating must be a number' })
  @IsInt({ message: 'Feedback rating must be an integer' })
  @Min(1, { message: 'Feedback rating must be at least 1' })
  @Max(5, { message: 'Feedback rating must be at most 5' })
  feedback_rating?: number;

  @ApiPropertyOptional({
    description: 'Feedback comments',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Feedback comments must be a string' })
  feedback_comments?: string;

  @ApiPropertyOptional({
    description: 'Whether this work order was reopened as warranty',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Reopened as warranty must be a boolean' })
  reopened_as_warranty?: boolean;

  @ApiPropertyOptional({
    description: 'Internal notes for the work order',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;

  @ApiPropertyOptional({
    type: [Number],
    description:
      'Array of service IDs (Required when request_type = 1, not allowed when request_type = 0)',
    required: false,
  })
  @IsOptional()
  @Validate(ServicesArrayValidationForUpdate) // Using the update-specific validator
  @IsArray({ message: 'Services must be an array' })
  @Type(() => Number)
  @IsInt({ each: true, message: 'Each service ID must be an integer' })
  @IsPositive({ each: true, message: 'Each service ID must be positive' })
  services?: number[];
}
