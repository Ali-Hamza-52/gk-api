import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Type,
} from '@nestjs/common';
import 'reflect-metadata';

@Injectable()
export class SwaggerTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const dtoClass = metadata.metatype as Type<any>;

    // ✅ Also allow plain JS objects
    if (!dtoClass || typeof value !== 'object') return value;

    const instance = new dtoClass(); // handles PartialType DTOs too
    const keys = Object.keys(value);

    for (const key of keys) {
      const designType = Reflect.getMetadata('design:type', instance, key);
      if (!designType || !(key in value)) continue;

      const originalValue = value[key];

      // Convert string → number
      if (designType === Number && typeof originalValue === 'string') {
        const parsed = Number(originalValue);
        if (!isNaN(parsed)) value[key] = parsed;
      }

      // Convert string → array
      if (designType === Array && typeof originalValue === 'string') {
        try {
          value[key] = JSON.parse(originalValue);
        } catch {
          if (/^\d+(,\d+)*$/.test(originalValue)) {
            value[key] = originalValue
              .split(',')
              .map((v: string) => Number(v.trim()));
          } else {
            throw new BadRequestException(`Invalid array value in "${key}"`);
          }
        }
      }
    }

    return value;
  }
}
