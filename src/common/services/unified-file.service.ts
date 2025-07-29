import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';
import { existsSync, mkdirSync } from 'fs';
import * as sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

export interface FileStorageOptions {
  generateThumbnails?: boolean;
  thumbnailSizes?: number[];
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding?: string;
  mimetype: string;
  size: number;
  buffer?: Buffer;
}

export interface FileStorageResult {
  originalName: string;
  storedPath: string;
  url: string;
  size: number;
  mimeType: string;
  thumbnails?: {
    size: number;
    path: string;
    url: string;
  }[];
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

@Injectable()
export class UnifiedFileService {
  private readonly baseUploadPath = './public/uploads';
  private readonly defaultThumbnailSizes = [150, 300];
  private readonly defaultMaxFileSize = 52428800; // 50MB

  private readonly allowedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  private readonly allowedDocumentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  private readonly allowedImageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.gif',
  ];
  private readonly allowedDocumentExtensions = [
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
  ];

  async storeFiles(
    files: (Express.Multer.File | MulterFile)[],
    module: string,
    field: string,
    recordId: number,
    options: FileStorageOptions = {},
  ): Promise<FileStorageResult[]> {
    const results: FileStorageResult[] = [];

    const moduleDir = join(this.baseUploadPath, module);
    const fieldDir = join(moduleDir, field);

    this.ensureDirectoryExists(fieldDir);

    const existingFiles = await this.getExistingFileCount(fieldDir, recordId);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileIndex = existingFiles + i + 1;

      const validation = this.validateFile(file, options);
      if (!validation.isValid) {
        throw new Error(
          `File validation failed: ${validation.errors.join(', ')}`,
        );
      }

      const ext = this.getFileExtension(file.originalname);
      const fileName = `${recordId}_${fileIndex}${ext}`;
      const filePath = join(fieldDir, fileName);

      await fs.writeFile(filePath, file.buffer || Buffer.from(''));

      const relativePath = `uploads/${module}/${field}/${fileName}`;
      const url = `${process.env.APP_URL}/${relativePath}`;

      const result: FileStorageResult = {
        originalName: file.originalname,
        storedPath: relativePath,
        url,
        size: file.size,
        mimeType: file.mimetype,
      };

      if (options.generateThumbnails !== false && this.isImage(file)) {
        result.thumbnails = await this.generateThumbnails(
          filePath,
          fieldDir,
          recordId,
          fileIndex,
          options.thumbnailSizes || this.defaultThumbnailSizes,
          module,
          field,
        );
      } else if (options.generateThumbnails !== false && this.isPdf(file)) {
        result.thumbnails = await this.generatePdfThumbnails(
          filePath,
          fieldDir,
          recordId,
          fileIndex,
          options.thumbnailSizes || this.defaultThumbnailSizes,
          module,
          field,
        );
      }

      results.push(result);
    }

    return results;
  }

  private validateFile(
    file: Express.Multer.File | MulterFile,
    options: FileStorageOptions,
  ): FileValidationResult {
    const errors: string[] = [];

    const maxSize = options.maxFileSize || this.defaultMaxFileSize;
    if (file.size > maxSize) {
      errors.push(
        `File size ${file.size} exceeds maximum allowed size ${maxSize}`,
      );
    }

    const allowedMimeTypes = options.allowedMimeTypes || [
      ...this.allowedImageTypes,
      ...this.allowedDocumentTypes,
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      errors.push(`MIME type ${file.mimetype} is not allowed`);
    }

    const ext = this.getFileExtension(file.originalname).toLowerCase();
    const allowedExtensions = options.allowedExtensions || [
      ...this.allowedImageExtensions,
      ...this.allowedDocumentExtensions,
    ];

    if (!allowedExtensions.includes(ext)) {
      errors.push(`File extension ${ext} is not allowed`);
    }

    if (
      file.originalname.includes('..') ||
      file.originalname.includes('/') ||
      file.originalname.includes('\\')
    ) {
      errors.push('File name contains invalid characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private async getExistingFileCount(
    fieldDir: string,
    recordId: number,
  ): Promise<number> {
    try {
      const files = await fs.readdir(fieldDir);
      const pattern = new RegExp(`^${recordId}_(\\d+)\\.[^.]+$`);
      const matchingFiles = files.filter((file) => pattern.test(file));

      if (matchingFiles.length === 0) return 0;

      const indices = matchingFiles.map((file) => {
        const match = file.match(pattern);
        return match ? parseInt(match[1], 10) : 0;
      });

      return Math.max(...indices);
    } catch (error) {
      return 0;
    }
  }

  private async generateThumbnails(
    originalPath: string,
    fieldDir: string,
    recordId: number,
    fileIndex: number,
    sizes: number[],
    module: string,
    field: string,
  ): Promise<{ size: number; path: string; url: string }[]> {
    const thumbnailDir = join(fieldDir, 'thumbnails');
    this.ensureDirectoryExists(thumbnailDir);

    const thumbnails: { size: number; path: string; url: string }[] = [];

    for (const size of sizes) {
      const thumbnailName = `${recordId}_${fileIndex}_thumb_${size}.jpg`;
      const thumbnailPath = join(thumbnailDir, thumbnailName);

      await sharp(originalPath)
        .resize(size, size, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      const relativePath = `uploads/${module}/${field}/thumbnails/${thumbnailName}`;
      const url = `${process.env.APP_URL}/${relativePath}`;

      thumbnails.push({
        size,
        path: relativePath,
        url,
      });
    }

    return thumbnails;
  }

  private async generatePdfThumbnails(
    originalPath: string,
    fieldDir: string,
    recordId: number,
    fileIndex: number,
    sizes: number[],
    module: string,
    field: string,
  ): Promise<{ size: number; path: string; url: string }[]> {
    try {
      const thumbnailDir = join(fieldDir, 'thumbnails');
      this.ensureDirectoryExists(thumbnailDir);

      const pdfBuffer = await fs.readFile(originalPath);
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pages = pdfDoc.getPages();

      if (pages.length === 0) return [];

      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      const tempPngPath = join(
        thumbnailDir,
        `temp_${recordId}_${fileIndex}.png`,
      );

      const canvas = require('canvas');
      const canvasInstance = canvas.createCanvas(width, height);
      const context = canvasInstance.getContext('2d');

      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);

      const buffer = canvasInstance.toBuffer('image/png');
      await fs.writeFile(tempPngPath, buffer);

      const thumbnails: { size: number; path: string; url: string }[] = [];

      for (const size of sizes) {
        const thumbnailName = `${recordId}_${fileIndex}_thumb_${size}.jpg`;
        const thumbnailPath = join(thumbnailDir, thumbnailName);

        await sharp(tempPngPath)
          .resize(size, size, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toFile(thumbnailPath);

        const relativePath = `uploads/${module}/${field}/thumbnails/${thumbnailName}`;
        const url = `${process.env.APP_URL}/${relativePath}`;

        thumbnails.push({
          size,
          path: relativePath,
          url,
        });
      }

      await fs.unlink(tempPngPath);

      return thumbnails;
    } catch (error) {
      return [];
    }
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  }

  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';
  }

  private isImage(file: Express.Multer.File | MulterFile): boolean {
    return this.allowedImageTypes.includes(file.mimetype);
  }

  private isPdf(file: Express.Multer.File | MulterFile): boolean {
    return file.mimetype === 'application/pdf';
  }

  async deleteFile(
    module: string,
    field: string,
    recordId: number,
    fileIndex: number,
  ): Promise<boolean> {
    try {
      const fieldDir = join(this.baseUploadPath, module, field);
      const files = await fs.readdir(fieldDir);
      const pattern = new RegExp(`^${recordId}_${fileIndex}\\.[^.]+$`);
      const fileToDelete = files.find((file) => pattern.test(file));

      if (fileToDelete) {
        await fs.unlink(join(fieldDir, fileToDelete));

        const thumbnailDir = join(fieldDir, 'thumbnails');
        if (existsSync(thumbnailDir)) {
          const thumbnailPattern = new RegExp(
            `^${recordId}_${fileIndex}_thumb_\\d+\\.jpg$`,
          );
          const thumbnailFiles = await fs.readdir(thumbnailDir);
          const thumbnailsToDelete = thumbnailFiles.filter((file) =>
            thumbnailPattern.test(file),
          );

          for (const thumbnail of thumbnailsToDelete) {
            await fs.unlink(join(thumbnailDir, thumbnail));
          }
        }

        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async getFileList(
    module: string,
    field: string,
    recordId: number,
  ): Promise<FileStorageResult[]> {
    try {
      const fieldDir = join(this.baseUploadPath, module, field);
      const files = await fs.readdir(fieldDir);
      const pattern = new RegExp(`^${recordId}_(\\d+)\\.[^.]+$`);
      const matchingFiles = files.filter((file) => pattern.test(file));

      const results: FileStorageResult[] = [];

      for (const file of matchingFiles) {
        const filePath = join(fieldDir, file);
        const stats = await fs.stat(filePath);
        const relativePath = `uploads/${module}/${field}/${file}`;
        const url = `${process.env.APP_URL}/${relativePath}`;

        const result: FileStorageResult = {
          originalName: file,
          storedPath: relativePath,
          url,
          size: stats.size,
          mimeType: this.getMimeTypeFromExtension(file),
        };

        const thumbnailDir = join(fieldDir, 'thumbnails');
        if (existsSync(thumbnailDir)) {
          const match = file.match(pattern);
          if (match) {
            const fileIndex = match[1];
            const thumbnailPattern = new RegExp(
              `^${recordId}_${fileIndex}_thumb_(\\d+)\\.jpg$`,
            );
            const thumbnailFiles = await fs.readdir(thumbnailDir);
            const matchingThumbnails = thumbnailFiles.filter((thumb) =>
              thumbnailPattern.test(thumb),
            );

            result.thumbnails = matchingThumbnails.map((thumb) => {
              const sizeMatch = thumb.match(thumbnailPattern);
              const size = sizeMatch ? parseInt(sizeMatch[1], 10) : 150;
              const relativePath = `uploads/${module}/${field}/thumbnails/${thumb}`;
              const url = `${process.env.APP_URL}/${relativePath}`;

              return { size, path: relativePath, url };
            });
          }
        }

        results.push(result);
      }

      return results.sort((a, b) => a.storedPath.localeCompare(b.storedPath));
    } catch (error) {
      return [];
    }
  }

  private getMimeTypeFromExtension(filename: string): string {
    const ext = this.getFileExtension(filename).toLowerCase();
    const mimeMap: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    return mimeMap[ext] || 'application/octet-stream';
  }
}
