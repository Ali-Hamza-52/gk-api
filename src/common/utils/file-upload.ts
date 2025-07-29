import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';

// Helper: Check if image
function isImage(ext: string): boolean {
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext.toLowerCase());
}

// Helper: Check if PDF
function isPdf(ext: string): boolean {
  return ext.toLowerCase() === '.pdf';
}

// Compress and save image (retain format)
async function compressImage(buffer: Buffer, outputPath: string, ext: string) {
  const image = sharp(buffer).resize({ width: 1280, withoutEnlargement: true });

  if (ext === '.jpg' || ext === '.jpeg') {
    await image.jpeg({ quality: 70 }).toFile(outputPath);
  } else if (ext === '.png') {
    await image.png({ compressionLevel: 9 }).toFile(outputPath);
  } else if (ext === '.webp') {
    await image.webp({ quality: 70 }).toFile(outputPath);
  } else {
    await fs.promises.writeFile(outputPath, buffer); // fallback
  }
}

// Compress and save PDF
async function compressPdf(inputBuffer: Buffer, outputPath: string) {
  const pdfDoc = await PDFDocument.load(inputBuffer);
  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
  pages.forEach((page) => newPdf.addPage(page));
  const compressed = await newPdf.save();
  await fs.promises.writeFile(outputPath, compressed);
}

// Store multiple files (no compression, same as original)
export function storeMultipleFiles(
  files: Express.Multer.File[],
  folder: string,
  id: number,
  startIndex = 0,
): string[] {
  const uploadsDir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'public',
    'uploads',
    folder,
  );
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  let index = startIndex;
  return files.map((file) => {
    const ext = path.extname(file.originalname);
    const fileName = `${id}_${++index}${ext}`;
    const fullPath = path.join(uploadsDir, fileName);
    fs.writeFileSync(fullPath, file.buffer);
    return `/uploads/${folder}/${fileName}`;
  });
}

// Store single file with compression for image and pdf
export async function storeFile(
  file: Express.Multer.File,
  folder: string,
  id: number,
  label: string,
): Promise<string> {
  const uploadsDir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'public',
    'uploads',
    folder,
  );
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const ext = path.extname(file.originalname).toLowerCase();
  const fileName = `${id}_${label}${ext}`;
  const fullPath = path.join(uploadsDir, fileName);

  if (isImage(ext)) {
    await compressImage(file.buffer, fullPath, ext);
  } else if (isPdf(ext)) {
    await compressPdf(file.buffer, fullPath);
  } else {
    await fs.promises.writeFile(fullPath, file.buffer);
  }

  return `/uploads/${folder}/${fileName}`;
}
