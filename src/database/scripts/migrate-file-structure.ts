import { promises as fs } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';

interface FileMapping {
  oldPath: string;
  newPath: string;
  module: string;
  field: string;
  recordId: number;
}

export class FileStructureMigration {
  private readonly baseUploadPath = './public/uploads';

  async migrateFiles(): Promise<void> {
    console.log('Starting file structure migration...');

    const mappings = await this.scanExistingFiles();
    console.log(`Found ${mappings.length} files to migrate`);

    for (const mapping of mappings) {
      await this.moveFile(mapping);
    }

    console.log('File structure migration completed');
  }

  private async scanExistingFiles(): Promise<FileMapping[]> {
    const mappings: FileMapping[] = [];

    const oldPatterns = [
      { pattern: 'Employee/*', module: 'Employee' },
      { pattern: 'vendors/*', module: 'Vendors' },
      { pattern: 'clients/*', module: 'Clients' },
      { pattern: 'Assets/*', module: 'Assets' },
      {
        pattern: 'Accommodation/Contracts/*',
        module: 'Accommodation',
        field: 'contract_attachment',
      },
      { pattern: 'Accommodation/Payments/*', module: 'Accommodation' },
      { pattern: 'Accommodation/Bill-Payments/*', module: 'Accommodation' },
    ];

    for (const pattern of oldPatterns) {
      const files = await this.findFilesMatchingPattern(pattern.pattern);
      for (const file of files) {
        const mapping = this.createMapping(file, pattern.module, pattern.field);
        if (mapping) {
          mappings.push(mapping);
        }
      }
    }

    return mappings;
  }

  private async findFilesMatchingPattern(pattern: string): Promise<string[]> {
    const files: string[] = [];
    const searchPath = join(this.baseUploadPath, pattern.replace('/*', ''));

    if (!existsSync(searchPath)) {
      return files;
    }

    const entries = await fs.readdir(searchPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile()) {
        files.push(join(searchPath, entry.name));
      } else if (entry.isDirectory()) {
        const subFiles = await this.findFilesInDirectory(
          join(searchPath, entry.name),
        );
        files.push(...subFiles);
      }
    }

    return files;
  }

  private async findFilesInDirectory(dirPath: string): Promise<string[]> {
    const files: string[] = [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);
        if (entry.isFile()) {
          files.push(fullPath);
        } else if (entry.isDirectory()) {
          const subFiles = await this.findFilesInDirectory(fullPath);
          files.push(...subFiles);
        }
      }
    } catch (error) {
      console.warn(`Could not read directory ${dirPath}:`, error);
    }

    return files;
  }

  private createMapping(
    filePath: string,
    module: string,
    defaultField?: string,
  ): FileMapping | null {
    const relativePath = filePath.replace(this.baseUploadPath + '/', '');
    const pathParts = relativePath.split('/');

    let recordId: number;
    let field: string;

    if (module === 'Employee' && pathParts.length >= 3) {
      recordId = parseInt(pathParts[1], 10);
      field = pathParts[2];
    } else if (module === 'Assets' && pathParts.length >= 3) {
      recordId = parseInt(pathParts[1], 10);
      field = pathParts[2];
    } else if (defaultField) {
      const fileName = pathParts[pathParts.length - 1];
      const match = fileName.match(/(\d+)/);
      recordId = match ? parseInt(match[1], 10) : 0;
      field = defaultField;
    } else {
      const fileName = pathParts[pathParts.length - 1];
      const parts = fileName.split('_');
      if (parts.length >= 2) {
        recordId = parseInt(parts[1], 10);
        field = parts[0];
      } else {
        return null;
      }
    }

    if (isNaN(recordId)) {
      return null;
    }

    const fileName = pathParts[pathParts.length - 1];
    const ext = fileName.substring(fileName.lastIndexOf('.'));
    const newFileName = `${recordId}_1${ext}`;
    const newPath = join(this.baseUploadPath, module, field, newFileName);

    return {
      oldPath: filePath,
      newPath,
      module,
      field,
      recordId,
    };
  }

  private async moveFile(mapping: FileMapping): Promise<void> {
    try {
      const newDir = join(this.baseUploadPath, mapping.module, mapping.field);

      if (!existsSync(newDir)) {
        await fs.mkdir(newDir, { recursive: true });
      }

      if (existsSync(mapping.oldPath) && !existsSync(mapping.newPath)) {
        await fs.copyFile(mapping.oldPath, mapping.newPath);
        console.log(`Migrated: ${mapping.oldPath} -> ${mapping.newPath}`);
      }
    } catch (error) {
      console.error(`Failed to migrate ${mapping.oldPath}:`, error);
    }
  }
}

if (require.main === module) {
  const migration = new FileStructureMigration();
  migration.migrateFiles().catch(console.error);
}
