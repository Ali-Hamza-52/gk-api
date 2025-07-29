import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileHelper } from './helpers/file.helper';
import { RequestLogService } from './services/request-log.service';
import { UnifiedFileService } from './services/unified-file.service';
import { RequestLogEntity } from './entities/request-log.entity';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([RequestLogEntity])],
  providers: [FileHelper, RequestLogService, UnifiedFileService],
  exports: [FileHelper, RequestLogService, UnifiedFileService],
})
export class CommonModule {}
