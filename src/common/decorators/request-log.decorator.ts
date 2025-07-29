import { SetMetadata } from '@nestjs/common';

export const REQUEST_LOG_METADATA = 'request_log_metadata';

export interface RequestLogOptions {
  module: string;
  recordIdKey: string;
}

export const RequestLog = (options: RequestLogOptions) =>
  SetMetadata(REQUEST_LOG_METADATA, options);
