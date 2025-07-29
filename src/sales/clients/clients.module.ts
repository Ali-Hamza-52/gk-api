import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientEntity } from './client.entity';
import { ClientServiceEntity } from './client-service.entity';
import { ClientLocationEntity } from './client-location.entity';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { PermissionsModule } from '@/permissions/permissions.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ClientEntity,
      ClientServiceEntity,
      ClientLocationEntity,
    ]),
    PermissionsModule,
  ],
  providers: [ClientService],
  controllers: [ClientController],
})
export class ClientsModule {}
