import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from './sequelize.config';
import { RequestLogEntity } from '@/common/entities/request-log.entity';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    SequelizeModule.forFeature([RequestLogEntity]),
  ],
})
export class DatabaseModule {}
