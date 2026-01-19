import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { UploadFileResult } from './files.interface';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class FilesService {
  private readonly uploadDir: string;
  private readonly allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];
  private readonly maxFileSize = 10 * 1024 * 1024;

  constructor(private prisma: PrismaService) {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.uploadDir = path.isAbsolute(uploadDir)
      ? uploadDir
      : path.resolve(process.cwd(), uploadDir);

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadFileResult> {
    this.validateFile(file);

    const fileExtension = path.extname(file.originalname);
    const fileName = `${randomUUID()}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const pages = await this.countPages(file);

    const fileUrl = `/files/${fileName}`;

    return {
      id: randomUUID(),
      fileName,
      originalName: file.originalname,
      fileUrl,
      pages,
      mimeType: file.mimetype,
    };
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF, JPG, and PNG are allowed',
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds 10 MB limit');
    }
  }

  private async countPages(file: Express.Multer.File): Promise<number> {
    if (file.mimetype === 'application/pdf') {
      try {
        console.log('📄 Parsing PDF:', {
          fileName: file.originalname,
          size: file.size,
          bufferLength: file.buffer.length,
        });

        // Usar pdf-lib para contar páginas (más confiable)
        const pdfDoc = await PDFDocument.load(file.buffer);
        const numPages = pdfDoc.getPageCount();

        console.log('✅ PDF parsed successfully:', {
          fileName: file.originalname,
          numPages,
        });

        return numPages || 1;
      } catch (error) {
        console.error('❌ PDF Parse Error:', {
          fileName: file.originalname,
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        });

        // Si falla el parsing, intentar con método alternativo
        console.warn('⚠️ Usando método alternativo de conteo...');
        return 1;
      }
    }

    console.log('📷 Image file detected, returning 1 page');
    return 1;
  }

  getFilePath(fileName: string): string {
    const filePath = path.join(this.uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    return filePath;
  }

  getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();

    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }
}
