// src/common/services/request-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RequestLogEntity } from '../entities/request-log.entity';

export interface RequestLogData {
  userId: number;
  module: string;
  recordId: number;
  status: string;
  payload: string;
  url: string;
  method: string;
}

@Injectable()
export class RequestLogService {
  constructor(
    @InjectModel(RequestLogEntity)
    private readonly requestLogModel: typeof RequestLogEntity,
  ) {}

  async log(data: RequestLogData) {
    await this.requestLogModel.create({
      user_id: data.userId,
      module: data.module,
      record_id: data.recordId,
      status: data.status,
      payload: data.payload,
      url: data.url,
      method: data.method,
      created_by: data.userId,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
}
