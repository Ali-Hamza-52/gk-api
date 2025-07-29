// src/common/helpers/file.helper.ts
import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';

export interface FileMetadata {
  size: number;
  mimeType: string;
  exists: boolean;
  thumbnails?: {
    size: number;
    url: string;
  }[];
}

@Injectable()
export class FileHelper {
  getFileUrl(path: string | null) {
    if (!path) return null;
    return `${process.env.APP_URL}/${path}`;
  }

  getThumbnailUrl(
    path: string | null,
    size: 'small' | 'medium' = 'small',
  ): string | null {
    if (!path) return null;

    const thumbnailSize = size === 'small' ? 150 : 300;

    const pathParts = path.split('/');
    const fileName = pathParts.pop();
    const directory = pathParts.join('/');

    if (!fileName) return null;

    const fileNameParts = fileName.split('.');
    const extension = fileNameParts.pop();
    const baseName = fileNameParts.join('.');

    const thumbnailPath = `${directory}/thumbnails/${baseName}_thumb_${thumbnailSize}.jpg`;

    return `${process.env.APP_URL}/${thumbnailPath}`;
  }

  async getFileMetadata(path: string): Promise<FileMetadata> {
    try {
      const fullPath = join('./public', path);

      if (!existsSync(fullPath)) {
        return {
          size: 0,
          mimeType: 'unknown',
          exists: false,
        };
      }

      const stats = await fs.stat(fullPath);
      const mimeType = this.getMimeTypeFromPath(path);

      const metadata: FileMetadata = {
        size: stats.size,
        mimeType,
        exists: true,
      };

      const thumbnails = await this.getThumbnailsForFile(path);
      if (thumbnails.length > 0) {
        metadata.thumbnails = thumbnails;
      }

      return metadata;
    } catch (error) {
      return {
        size: 0,
        mimeType: 'unknown',
        exists: false,
      };
    }
  }

  private async getThumbnailsForFile(
    path: string,
  ): Promise<{ size: number; url: string }[]> {
    try {
      const pathParts = path.split('/');
      const fileName = pathParts.pop();
      const directory = pathParts.join('/');

      if (!fileName) return [];

      const fileNameParts = fileName.split('.');
      const baseName = fileNameParts.slice(0, -1).join('.');

      const thumbnailDir = join('./public', directory, 'thumbnails');

      if (!existsSync(thumbnailDir)) return [];

      const files = await fs.readdir(thumbnailDir);
      const pattern = new RegExp(
        `^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}_thumb_(\\d+)\\.jpg$`,
      );

      const thumbnails = files
        .filter((file) => pattern.test(file))
        .map((file) => {
          const match = file.match(pattern);
          const size = match ? parseInt(match[1], 10) : 150;
          const url = `${process.env.APP_URL}/${directory}/thumbnails/${file}`;
          return { size, url };
        })
        .sort((a, b) => a.size - b.size);

      return thumbnails;
    } catch (error) {
      return [];
    }
  }

  private getMimeTypeFromPath(path: string): string {
    const extension = path.split('.').pop()?.toLowerCase();

    const mimeMap: { [key: string]: string } = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    return mimeMap[extension || ''] || 'application/octet-stream';
  }
}
