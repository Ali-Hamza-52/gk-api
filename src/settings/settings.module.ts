import { Module, Controller } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Entities
import { AssetTypeEntity } from './asset-type/entities/asset-type.entity';
import { AssetMakeEntity } from './asset-make/entities/asset-make.entity';
import { AssetCapacityEntity } from './asset-capacity/entities/asset-capacity.entity';
import { SkillEntity } from './skills/entities/skills.entity';

// Controllers
import { AssetTypeController } from './asset-type/asset-type.controller';
import { AssetMakeController } from './asset-make/asset-make.controller';
import { AssetCapacityController } from './asset-capacity/asset-capacity.controller';
import { SkillsController } from './skills/skills.controller';

// Services
import { AssetTypeService } from './asset-type/asset-type.service';
import { AssetMakeService } from './asset-make/asset-make.service';
import { AssetCapacityService } from './asset-capacity/asset-capacity.service';
import { SkillsService } from './skills/skills.service';
import { CityEntity } from './city/entities/city.entity';
import { CityService } from './city/city.service';
import { CityController } from './city/ city.controller';
import { NationalityEntity } from './nationality/entities/nationality.entity';
import { NationalityService } from './nationality/nationality.service';
import { NationalityController } from './nationality/nationality.controller';
import { BankEntity } from './bank/entities/bank.entity';
import { BankService } from './bank/bank.service';
import { BankController } from './bank/bank.controller';
import { ProductCategoriesController } from './products/categories/product-categories.controller';
import { ProductCategoriesService } from './products/categories/product-categories.service';
import { ProductCategoryEntity } from './products/categories/entities/product-category.entity';
import { OutletEntity } from './outlets/entities/outlet.entity';
import { OutletController } from './outlets/outlet.controller';
import { OutletService } from './outlets/outlet.service';
import { UnitEntity } from './units/entities/unit.entity';
import { UnitController } from './units/unit.controller';
import { UnitService } from './units/unit.service';
import { ProductServiceEntity } from './products/entities/product.entity';
import { ProductServiceController } from './products/product-service.controller';
import { ProductService } from './products/product-service.service';
import { MaterialCategoryEntity } from './material-categories/entities/material-category.entity';
import { MaterialEntity } from './materials/entities/material.entity';
import { MaterialCategoryController } from './material-categories/material-category.controller';
import { MaterialController } from './materials/materials.controller';
import { MaterialCategoryService } from './material-categories/material-category.service';
import { MaterialService } from './materials/materials.service';
import { ProfessionController } from './profession/profession.controller';
import { ProfessionEntity } from './profession/entities/profession.entity';
import { ProfessionService } from './profession/profession.service';
import { WarehouseEntity } from './warehouse/entities/warehouse.entity';
import { WarehouseController } from './warehouse/warehouse.controller';
import { WarehouseService } from './warehouse/warehouse.service';
import { ClientPricingRulesModule } from './client-pricing-rules/client-pricing-rules.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AssetTypeEntity,
      AssetMakeEntity,
      AssetCapacityEntity,
      SkillEntity,
      CityEntity,
      NationalityEntity,
      BankEntity,
      ProductCategoryEntity,
      OutletEntity,
      UnitEntity,
      ProductServiceEntity,
      MaterialCategoryEntity,
      MaterialEntity,
      ProfessionEntity,
      WarehouseEntity,
    ]),
    ClientPricingRulesModule,
  ],
  controllers: [
    AssetTypeController,
    AssetMakeController,
    AssetCapacityController,
    SkillsController,
    CityController,
    NationalityController,
    BankController,
    ProductCategoriesController,
    OutletController,
    UnitController,
    ProductServiceController,
    MaterialCategoryController,
    MaterialController,
    ProfessionController,
    WarehouseController,
  ],
  providers: [
    AssetTypeService,
    AssetMakeService,
    AssetCapacityService,
    SkillsService,
    CityService,
    NationalityService,
    BankService,
    ProductCategoriesService,
    OutletService,
    UnitService,
    ProductService,
    MaterialCategoryService,
    MaterialService,
    ProfessionService,
    WarehouseService,
  ],
})
export class SettingsModule {}
