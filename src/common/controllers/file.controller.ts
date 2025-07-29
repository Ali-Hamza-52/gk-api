import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UnifiedFileService } from '../services/unified-file.service';
import { FileHelper } from '../helpers/file.helper';

@ApiTags('Files')
@Controller('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FileController {
  constructor(
    private readonly unifiedFileService: UnifiedFileService,
    private readonly fileHelper: FileHelper,
  ) {}

  @Get(':module/:field/:recordId')
  @ApiOperation({ summary: 'List files for a specific record and field' })
  @ApiResponse({ status: 200, description: 'Files retrieved successfully' })
  async listFiles(
    @Param('module') module: string,
    @Param('field') field: string,
    @Param('recordId') recordId: string,
  ) {
    try {
      const files = await this.unifiedFileService.getFileList(
        module,
        field,
        parseInt(recordId, 10),
      );

      return {
        success: true,
        data: files,
        count: files.length,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve files',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':module/:field/:recordId/thumbnails')
  @ApiOperation({ summary: 'Get thumbnails for files' })
  @ApiResponse({
    status: 200,
    description: 'Thumbnails retrieved successfully',
  })
  async getThumbnails(
    @Param('module') module: string,
    @Param('field') field: string,
    @Param('recordId') recordId: string,
  ) {
    try {
      const files = await this.unifiedFileService.getFileList(
        module,
        field,
        parseInt(recordId, 10),
      );

      const thumbnails = files
        .filter((file) => file.thumbnails && file.thumbnails.length > 0)
        .map((file) => ({
          originalFile: file.storedPath,
          thumbnails: file.thumbnails,
        }));

      return {
        success: true,
        data: thumbnails,
        count: thumbnails.length,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve thumbnails',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':module/:field/:recordId/:fileIndex')
  @ApiOperation({ summary: 'Delete a specific file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  async deleteFile(
    @Param('module') module: string,
    @Param('field') field: string,
    @Param('recordId') recordId: string,
    @Param('fileIndex') fileIndex: string,
  ) {
    try {
      const success = await this.unifiedFileService.deleteFile(
        module,
        field,
        parseInt(recordId, 10),
        parseInt(fileIndex, 10),
      );

      if (!success) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'File deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to delete file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':module/:field/:recordId/:filename/metadata')
  @ApiOperation({ summary: 'Get file metadata' })
  @ApiResponse({
    status: 200,
    description: 'File metadata retrieved successfully',
  })
  async getFileMetadata(
    @Param('module') module: string,
    @Param('field') field: string,
    @Param('recordId') recordId: string,
    @Param('filename') filename: string,
  ) {
    try {
      const path = `uploads/${module}/${field}/${filename}`;
      const metadata = await this.fileHelper.getFileMetadata(path);

      if (!metadata.exists) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: metadata,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to retrieve file metadata',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
