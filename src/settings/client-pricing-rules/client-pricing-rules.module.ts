import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientPricingRule } from './entities/client-pricing-rule.entity';
import { ClientEntity } from '@/sales/clients/client.entity';
import { ClientPricingRulesService } from './client-pricing-rules.service';
import { ClientPricingRulesController } from './client-pricing-rules.controller';
import { PermissionsModule } from '@/permissions/permissions.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ClientPricingRule, ClientEntity]),
    PermissionsModule,
  ],
  providers: [ClientPricingRulesService],
  controllers: [ClientPricingRulesController],
  exports: [ClientPricingRulesService],
})
export class ClientPricingRulesModule {}
