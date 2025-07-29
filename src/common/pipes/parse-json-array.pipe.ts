import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonArrayPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value.services === 'string') {
      try {
        const parsed = JSON.parse(value.services);
        if (!Array.isArray(parsed)) {
          throw new BadRequestException('services must be a JSON array');
        }
        value.services = parsed;
      } catch (e) {
        throw new BadRequestException('Invalid JSON in services field');
      }
    }
    return value;
  }
}
