import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

// Handle empty strings for date fields
const EmptyStringToNull = () =>
  Transform(({ value }) =>
    value === '' || value === 'Invalid date' ? null : value,
  );

// Handle empty strings for number fields
const EmptyStringToNullNumber = () =>
  Transform(({ value }) =>
    value === '' || value === null ? null : Number(value),
  );

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Sudhir Baliram Shirsat' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'India' })
  @IsOptional()
  nationality?: string;

  @ApiPropertyOptional({ example: 'Other' })
  @IsOptional()
  religion?: string;

  @ApiPropertyOptional({ example: '1970-05-02' })
  @IsOptional()
  @IsDateString()
  @EmptyStringToNull()
  dob?: string;

  @ApiPropertyOptional({ example: '2022-02-02' })
  @IsOptional()
  @IsDateString()
  @EmptyStringToNull()
  joining_date?: string;

  @ApiPropertyOptional({ example: 53 })
  @IsOptional()
  @IsNumber()
  @EmptyStringToNullNumber()
  age?: number;

  @ApiPropertyOptional({ example: '966570252701' })
  @IsOptional()
  contact_number?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  emp_photo?: any;

  @ApiPropertyOptional()
  @IsOptional()
  benefits?: string;

  @ApiPropertyOptional({ example: 'SA4910000016300001154706' })
  @IsOptional()
  iban?: string;

  @ApiPropertyOptional({ example: '2022-02-02' })
  @IsOptional()
  @IsDateString()
  @EmptyStringToNull()
  vacation_date?: string;

  @ApiPropertyOptional({ example: 'good' })
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  passport?: any;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  passport_2?: any;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  ajeer?: any;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  insurance_card?: any;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  iqama?: any;

  @ApiPropertyOptional({ example: 2517834756 })
  @IsOptional()
  @IsNumber()
  @EmptyStringToNullNumber()
  iqama_no?: number;

  @ApiPropertyOptional({ example: '2023-10-20' })
  @IsOptional()
  @IsDateString()
  @EmptyStringToNull()
  iqama_expiry_date?: string;

  @ApiPropertyOptional({ example: 'Labor' })
  @IsOptional()
  iqama_profession?: string;

  @ApiPropertyOptional({ example: 'R2297663' })
  @IsOptional()
  passport_number?: string;

  @ApiPropertyOptional({ example: '2027-03-29' })
  @IsOptional()
  @IsDateString()
  @EmptyStringToNull()
  passport_expiry_date?: string;

  @ApiPropertyOptional({ example: '2023-09-23' })
  @IsOptional()
  @IsDateString()
  @EmptyStringToNull()
  ajeer_expiration_date?: string;

  @ApiPropertyOptional({ example: '2023-09-23' })
  @IsOptional()
  @IsDateString()
  @EmptyStringToNull()
  insurance_card_expirationDate?: string;

  @ApiPropertyOptional({ example: 74 })
  @IsOptional()
  @EmptyStringToNullNumber()
  vendor?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @EmptyStringToNullNumber()
  salary_rate?: number;

  @ApiPropertyOptional({ example: '10013' })
  @IsOptional()
  client?: string;

  @ApiPropertyOptional({ example: 'Nafcel - Jeddah' })
  @IsOptional()
  client_location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  staging_client?: string;

  @ApiPropertyOptional({ example: 'Terminated' })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 49 })
  @IsOptional()
  @EmptyStringToNullNumber()
  accommodation?: number;

  @ApiPropertyOptional({ example: '2023-04-01' })
  @IsOptional()
  @IsDateString()
  @EmptyStringToNull()
  contract_start?: string;

  @ApiPropertyOptional({ example: '2023-04-01' })
  @IsOptional()
  @IsDateString()
  @EmptyStringToNull()
  project_stop_date?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @EmptyStringToNullNumber()
  lang_eng?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @EmptyStringToNullNumber()
  lang_ar?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @EmptyStringToNullNumber()
  lang_hind?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @EmptyStringToNullNumber()
  appearance_presentable?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @EmptyStringToNullNumber()
  apprearance_beard?: number;

  @ApiPropertyOptional({ example: 'Forklift Operator' })
  @IsOptional()
  skills?: string;

  @ApiPropertyOptional({
    example: 'Knows Basic of forklift he has learned in Hygiene',
  })
  @IsOptional()
  misconduct?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @EmptyStringToNullNumber()
  rating?: number;

  // @ApiPropertyOptional({ example: 'Service Provider' })
  // @IsOptional()
  // employee_type?: string;

  @ApiPropertyOptional({ example: 'A' })
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({ example: '2023-04-01' })
  @IsOptional()
  @IsDateString()
  @EmptyStringToNull()
  employee_contract_start?: string;

  @ApiPropertyOptional({ example: '2053-04-01' })
  @IsOptional()
  @IsDateString()
  @EmptyStringToNull()
  contract_end?: string;

  @ApiPropertyOptional({ example: '2023-04-01' })
  @IsOptional()
  @IsDateString()
  @EmptyStringToNull()
  disconnection_date?: string;

  @ApiPropertyOptional({ example: 'Some reason' })
  @IsOptional()
  disconnection_reason?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @EmptyStringToNullNumber()
  total_leaves?: number;

  @ApiPropertyOptional({ example: 'Al Rajhi' })
  @IsOptional()
  bank_name?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @EmptyStringToNullNumber()
  vendor_rate?: number;

  @ApiPropertyOptional({ example: 700 })
  @IsOptional()
  @EmptyStringToNullNumber()
  monthly_other_allowance?: number;

  @ApiPropertyOptional({ example: 800 })
  @IsOptional()
  @EmptyStringToNullNumber()
  monthly_transportation_allowance?: number;

  @ApiPropertyOptional({ example: 900 })
  @IsOptional()
  @EmptyStringToNullNumber()
  monthly_housing_allowance?: number;
}
