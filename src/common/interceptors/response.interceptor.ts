// src/common/interceptors/response.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        // 💥 Here's the fix:
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          'total' in response &&
          'currentPage' in response
        ) {
          return response;
        }

        return {
          success: true,
          data: response,
        };
      }),
    );
  }
}
