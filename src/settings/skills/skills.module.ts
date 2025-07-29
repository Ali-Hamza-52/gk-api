import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { SkillEntity } from './entities/skills.entity';

@Module({
  imports: [SequelizeModule.forFeature([SkillEntity])],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService], // if needed elsewhere
})
export class SkillsModule {}
