import { PartialType } from '@nestjs/swagger';
import { CreateClientPricingRuleDto } from './create-client-pricing-rule.dto';

export class UpdateClientPricingRuleDto extends PartialType(
  CreateClientPricingRuleDto,
) {}
