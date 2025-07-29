import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClientEntity } from './client.entity';
import { ClientServiceEntity } from './client-service.entity';
import { ClientLocationEntity } from './client-location.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { paginateQuery } from 'src/common/utils/db-pagination';
import { MulterFile } from './types/multer-file.type';
import { UnifiedFileService } from 'src/common/services/unified-file.service';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { ClientServiceDto } from './dto/client-service.dto';
import { ClientLocationDto } from './dto/client-location.dto';
import { successResponse } from '@/common/utils/response';
import { PermissionService } from '@/permissions/permission.service';
import { applyCustomOwnershipFilter } from '@/common/utils/permission-filter';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(ClientEntity) private clientRepo: typeof ClientEntity,
    @InjectModel(ClientServiceEntity)
    private svcRepo: typeof ClientServiceEntity,
    @InjectModel(ClientLocationEntity)
    private locRepo: typeof ClientLocationEntity,
    private readonly unifiedFileService: UnifiedFileService,
    private permissionService: PermissionService,
  ) {}

  async getAll(query: {
    page?: number;
    perPage?: number;
    searchTerm?: string;
    userId?: number;
    role?: number;
    client_code?: string;
    client_name?: string;
    cr_no?: string;
    vat_no?: string;
    contract_status?: string;
  }) {
    const {
      page = 1,
      perPage = 10,
      searchTerm,
      userId,
      role,
      client_code,
      client_name,
      cr_no,
      vat_no,
      contract_status,
    } = query;

    let where: any = {};

    if (userId && role) {
      const hasViewAll = await this.permissionService.hasViewAllPermission(
        role,
        'client',
      );
      if (!hasViewAll) {
        where = applyCustomOwnershipFilter(where, userId, hasViewAll, [
          'sales_person',
          'created_by',
        ]);
      }
    }

    if (searchTerm) {
      where[Op.or] = [
        { client_code: { [Op.like]: `%${searchTerm}%` } },
        { client_name: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    if (client_code) where.client_code = { [Op.like]: `%${client_code}%` };
    if (client_name) where.client_name = { [Op.like]: `%${client_name}%` };
    if (cr_no) where.cr_no = cr_no;
    if (vat_no) where.vat_no = vat_no;
    if (contract_status) where.contract_status = contract_status;

    const result = await paginateQuery(this.clientRepo, {
      where,
      order: [['client_code', 'DESC']],
      raw: true,
      page,
      perPage,
    });

    return successResponse('Clients fetched successfully', result);
  }

  async create(
    dto: CreateClientDto,
    files?: Record<string, MulterFile[]>,
    userId?: number,
  ) {
    if (dto.cr_no) {
      const exists = await this.clientRepo.findOne({
        where: { cr_no: dto.cr_no },
      });
      if (exists) throw new BadRequestException('CR number exists');
    }
    if (dto.vat_no) {
      const exists = await this.clientRepo.findOne({
        where: { vat_no: dto.vat_no },
      });
      if (exists) throw new BadRequestException('VAT number exists');
    }

    const max = await this.clientRepo.max('client_code') as number;
    const code = (max || 0) + 1;
    const data: any = {
      client_code: code,
      ...dto,
      created_by: userId,
      created_at: new Date(),
    };

    if (files?.cr?.[0]) {
      const results = await this.unifiedFileService.storeFiles(
        [files.cr[0]],
        'Clients',
        'cr',
        code,
        {
          generateThumbnails: false,
          maxFileSize: 52428800,
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
          ],
        },
      );
      if (results.length > 0) {
        data.cr = results[0].storedPath;
      }
    }
    if (files?.vat_cert?.[0]) {
      const results = await this.unifiedFileService.storeFiles(
        [files.vat_cert[0]],
        'Clients',
        'vat_cert',
        code,
        {
          generateThumbnails: false,
          maxFileSize: 52428800,
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
          ],
        },
      );
      if (results.length > 0) {
        data.vat_cert = results[0].storedPath;
      }
    }
    const client = await this.clientRepo.create(data);

    if (dto.services?.length) {
      await this.svcRepo.bulkCreate(
        dto.services.map((s) => ({
          client: code,
          name: s.name,
          period: s.period,
          rate: s.rate,
          created_by: userId,
          created_at: new Date(),
        })),
      );
    }
    if (dto.locations?.length) {
      await this.locRepo.bulkCreate(
        dto.locations.map((l) => ({
          client_code: code,
          ...l,
          created_by: userId,
          created_at: new Date(),
        })),
      );
    }

    return successResponse('Client created', dto);
  }

  async getDetail(code: number) {
    const client = await this.clientRepo.findByPk(code, {
      include: [ClientServiceEntity, ClientLocationEntity],
    });
    if (!client) throw new NotFoundException('Invalid client code');

    return successResponse('Client detail fetched', client);
  }

  async update(
    code: number,
    dto: UpdateClientDto,
    files?: Record<string, MulterFile[]>,
    userId?: number,
  ) {
    const client = await this.clientRepo.findByPk(code, {
      include: [ClientServiceEntity, ClientLocationEntity],
    });
    if (!client) throw new NotFoundException('Invalid client code');

    if (dto.cr_no && dto.cr_no !== client.cr_no) {
      const ex = await this.clientRepo.findOne({
        where: { cr_no: dto.cr_no, client_code: { [Op.ne]: code } },
      });
      if (ex)
        throw new BadRequestException(
          'CR number already in use by another client',
        );
    }

    if (dto.vat_no && dto.vat_no !== client.vat_no) {
      const ex = await this.clientRepo.findOne({
        where: { vat_no: dto.vat_no, client_code: { [Op.ne]: code } },
      });
      if (ex)
        throw new BadRequestException(
          'VAT number already in use by another client',
        );
    }

    const updates: any = {
      ...dto,
      updated_by: userId,
      updated_at: new Date(),
    };
    if (files?.cr?.[0]) {
      const results = await this.unifiedFileService.storeFiles(
        [files.cr[0]],
        'Clients',
        'cr',
        code,
        {
          generateThumbnails: false,
          maxFileSize: 52428800,
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
          ],
        },
      );
      if (results.length > 0) {
        updates.cr = results[0].storedPath;
      }
    }
    if (files?.vat_cert?.[0]) {
      const results = await this.unifiedFileService.storeFiles(
        [files.vat_cert[0]],
        'Clients',
        'vat_cert',
        code,
        {
          generateThumbnails: false,
          maxFileSize: 52428800,
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
          ],
        },
      );
      if (results.length > 0) {
        updates.vat_cert = results[0].storedPath;
      }
    }

    const data = await client.update(updates);

    const existingServices = await this.svcRepo.findAll({
      where: { client: code },
    });
    const incomingServices = dto.services || [];

    const existingSvcMap = new Map(existingServices.map((s) => [s.id, s]));
    const incomingSvcMap = new Map<number, ClientServiceDto>(
      incomingServices.filter((s) => s.id !== undefined).map((s) => [s.id!, s]),
    );

    for (const [id, newSvc] of incomingSvcMap.entries()) {
      const existing = existingSvcMap.get(id);
      if (!existing) continue;

      if (
        existing.name !== newSvc.name ||
        existing.period !== newSvc.period ||
        existing.rate !== newSvc.rate
      ) {
        await this.svcRepo.update(
          {
            name: newSvc.name,
            period: newSvc.period,
            rate: newSvc.rate,
            updated_by: userId,
            updated_at: new Date(),
          },
          { where: { id } },
        );
      }
    }

    const newServices = incomingServices.filter((s) => !s.id);
    if (newServices.length) {
      await this.svcRepo.bulkCreate(
        newServices.map((s) => ({
          client: code,
          name: s.name,
          period: s.period,
          rate: s.rate,
          created_by: userId,
          created_at: new Date(),
        })),
      );
    }

    const incomingSvcIds = new Set(
      incomingServices.map((s) => s.id).filter(Boolean),
    );
    const toDeleteServices = existingServices.filter(
      (s) => !incomingSvcIds.has(s.id),
    );
    if (toDeleteServices.length) {
      await this.svcRepo.destroy({
        where: { id: toDeleteServices.map((s) => s.id) },
      });
    }

    const existingLocations = await this.locRepo.findAll({
      where: { client_code: code },
    });
    const incomingLocations = dto.locations || [];

    const existingLocMap = new Map(existingLocations.map((l) => [l.id, l]));
    const incomingLocMap = new Map<number, ClientLocationDto>(
      incomingLocations
        .filter((l) => l.id !== undefined)
        .map((l) => [l.id!, l]),
    );

    for (const [id, newLoc] of incomingLocMap.entries()) {
      const existing = existingLocMap.get(id);
      if (!existing) continue;

      if (
        existing.location_name !== newLoc.location_name ||
        existing.location_name_ar !== newLoc.location_name_ar ||
        existing.latitude !== newLoc.latitude ||
        existing.longitude !== newLoc.longitude ||
        existing.location_map !== newLoc.location_map
      ) {
        await this.locRepo.update(
          {
            location_name: newLoc.location_name,
            location_name_ar: newLoc.location_name_ar,
            latitude: newLoc.latitude,
            longitude: newLoc.longitude,
            location_map: newLoc.location_map,
            updated_by: userId,
            updated_at: new Date(),
          },
          { where: { id } },
        );
      }
    }

    const newLocations = incomingLocations.filter((l) => !l.id);
    if (newLocations.length) {
      await this.locRepo.bulkCreate(
        newLocations.map((l) => ({
          client_code: code,
          ...l,
          created_by: userId,
          created_at: new Date(),
        })),
      );
    }

    const incomingLocIds = new Set(
      incomingLocations.map((l) => l.id).filter(Boolean),
    );
    const toDeleteLocations = existingLocations.filter(
      (l) => !incomingLocIds.has(l.id),
    );
    if (toDeleteLocations.length) {
      await this.locRepo.destroy({
        where: { id: toDeleteLocations.map((l) => l.id) },
      });
    }

    return successResponse('Client updated', dto);
  }

  async delete(code: number) {
    const client = await this.clientRepo.findByPk(code);
    if (!client) throw new NotFoundException('Invalid client code');
    await client.destroy();
    return successResponse('Client deleted');
  }

  private async storeFile(
    file: MulterFile,
    field: string,
    code: number,
  ): Promise<string> {
    const uploadsDir = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'uploads',
      'clients',
    );
    if (!fs.existsSync(uploadsDir))
      fs.mkdirSync(uploadsDir, { recursive: true });

    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '_');
    const filename = `${field}_${code}_${timestamp}_${safeName}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, file.buffer);
    return `/uploads/clients/${filename}`;
  }

  async getDropdownOptions() {
    const clients = await this.clientRepo.findAll({
      attributes: ['client_code', 'client_name'],
      order: [['client_name', 'ASC']],
      raw: true,
    });

    const options = clients.map((client) => ({
      id: String(client.client_code),
      name: client.client_name,
    }));

    return successResponse('Clients dropdown fetched', options);
  }

  async getClientLocationsByClientCode(client_code: number) {
    const locations = await this.locRepo.findAll({
      where: { client_code },
      attributes: [
        'id',
        ['location_name', 'location_en'],
        ['location_name_ar', 'text_ar'],
        'latitude',
        'longitude',
        'location_map',
      ],
      raw: true,
    });


    return successResponse('Client locations fetched', locations);
  }

  async getClientSummary() {
    const activeClients = await this.clientRepo.count({
      where: { contract_status: 'Active' },
    });
    const underSigningClients = await this.clientRepo.count({
      where: { contract_status: 'Under-Signing' },
    });
    const expiredClients = await this.clientRepo.count({
      where: { contract_status: 'Expired' },
    });

    return successResponse('Client summary fetched', {
      activeClients,
      underSigningClients,
      expiredClients,
    });
  }
}
