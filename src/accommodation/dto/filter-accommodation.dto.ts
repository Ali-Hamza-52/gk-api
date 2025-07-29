// src/accommodation/dto/filter-accommodation.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterAccommodationDto {
  @ApiPropertyOptional({ example: '1' }) page?: number;
  @ApiPropertyOptional({ example: '15' }) perPage?: number;
  @ApiPropertyOptional() searchTerm?: string;
  @ApiPropertyOptional() id?: number;
  @ApiPropertyOptional() name?: string;
  @ApiPropertyOptional() location?: string;
  @ApiPropertyOptional() city?: string;
  @ApiPropertyOptional() address?: string;
  @ApiPropertyOptional() rooms?: number;
  @ApiPropertyOptional() beds?: number;
  @ApiPropertyOptional() contract_startdate?: string;
  @ApiPropertyOptional() contract_enddate?: string;
  @ApiPropertyOptional() rent?: number;
  @ApiPropertyOptional({ type: [String] }) services?: string[];
  @ApiPropertyOptional() dueDate?: string;
  @ApiPropertyOptional() period?: string;
  @ApiPropertyOptional() apartment?: string;
  @ApiPropertyOptional() electricityAccountNo?: string;
  @ApiPropertyOptional() waterBillAccountNo?: string;
  @ApiPropertyOptional() contactName?: string;
  @ApiPropertyOptional() contactNo?: string;
  @ApiPropertyOptional() accountName?: string;
  @ApiPropertyOptional() bankName?: string;
  @ApiPropertyOptional() iban?: string;
  @ApiPropertyOptional() fixedElectricityAmount?: number;
  @ApiPropertyOptional() fixedWaterAmount?: number;
  @ApiPropertyOptional() contract_type?: string;
  @ApiPropertyOptional() rent_payment_method?: string;
  @ApiPropertyOptional() salary?: number;
  @ApiPropertyOptional() employee_id?: number;
  @ApiPropertyOptional() accommodation_status?: string;
  @ApiPropertyOptional() contract_number?: string;
  @ApiPropertyOptional() notes?: string;
  @ApiPropertyOptional() lat?: string;
  @ApiPropertyOptional() lng?: string;
  @ApiPropertyOptional() created_by?: number;
  @ApiPropertyOptional() updated_by?: number;
}
