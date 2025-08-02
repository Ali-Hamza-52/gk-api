import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  Min,
  Max,
  IsInt,
  IsPositive,
} from 'class-validator';
import {
  ServiceCategory,
  PricingType,
  AppliesTo,
} from '../entities/client-pricing-rule.entity';

export class CreateClientPricingRuleDto {
  @ApiProperty({
    example: 1001,
    description: 'Client ID number from clients table',
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  client_code: number;

  @ApiProperty({
    enum: ServiceCategory,
    example: ServiceCategory.HVAC,
    description: 'Service category',
  })
  @IsEnum(ServiceCategory)
  category: ServiceCategory;

  @ApiProperty({
    enum: PricingType,
    example: PricingType.DISCOUNT,
    description: 'Type of pricing adjustment',
  })
  @IsEnum(PricingType)
  pricingType: PricingType;

  @ApiProperty({
    example: 10.5,
    description: 'Percentage value for adjustment (0-100)',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  percentageValue: number;

  @ApiProperty({
    enum: AppliesTo,
    isArray: true,
    example: [AppliesTo.SERVICE, AppliesTo.ADDON],
    description: 'What the pricing rule applies to (can select multiple)',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(AppliesTo, { each: true })
  appliesTo: AppliesTo[];
}
