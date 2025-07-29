import { SetMetadata } from '@nestjs/common';

export interface FileValidationOptions {
  types?: ('image' | 'document' | 'spreadsheet')[];
  maxSize?: string | number;
  required?: boolean;
  allowedExtensions?: string[];
  allowedMimeTypes?: string[];
}

export const FILE_VALIDATION_KEY = 'file_validation';

export const ValidateFile = (options: FileValidationOptions) =>
  SetMetadata(FILE_VALIDATION_KEY, options);

export function parseFileSize(size: string | number): number {
  if (typeof size === 'number') return size;

  const units: { [key: string]: number } = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  };

  const match = size.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i);
  if (!match) {
    throw new Error(`Invalid file size format: ${size}`);
  }

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  return Math.floor(value * units[unit]);
}

export function getFileTypeExtensions(type: string): string[] {
  const typeMap: { [key: string]: string[] } = {
    image: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    document: ['.pdf', '.doc', '.docx'],
    spreadsheet: ['.xls', '.xlsx'],
  };

  return typeMap[type] || [];
}

export function getFileTypeMimeTypes(type: string): string[] {
  const typeMap: { [key: string]: string[] } = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    document: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    spreadsheet: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
  };

  return typeMap[type] || [];
}
