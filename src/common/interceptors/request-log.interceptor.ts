// src/common/interceptors/request-log.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { RequestLogService } from '../services/request-log.service';
import {
  REQUEST_LOG_METADATA,
  RequestLogOptions,
} from '../decorators/request-log.decorator';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  constructor(
    private readonly requestLogService: RequestLogService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const user = req.user as any;
    const meta = this.reflector.get<RequestLogOptions>(
      REQUEST_LOG_METADATA,
      context.getHandler(),
    );

    return next.handle().pipe(
      tap(async (res) => {
        if (!meta || !user || !res?.success) return;

        const recordId = res.data?.[meta.recordIdKey];
        if (!recordId) return;

        const method = req.method; // e.g. "POST"
        const url = req.originalUrl || req.url; // full path+query

        await this.requestLogService.log({
          userId: user.userId,
          module: meta.module,
          recordId,
          status: 'SUCCESS',
          payload: JSON.stringify(req.body || {}),
          url,
          method,
        });
      }),
    );
  }
}
