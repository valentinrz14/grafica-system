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

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PDFParse } = require('pdf-parse') as {
  PDFParse: new (options: { url: string }) => {
    getInfo: (options: { parsePageInfo: boolean }) => Promise<{
      numPages: number;
    }>;
    destroy: () => Promise<void>;
  };
};

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
      let parser: InstanceType<typeof PDFParse> | null = null;
      try {
        const tempFileName = `${randomUUID()}.pdf`;
        const tempFilePath = path.join(this.uploadDir, tempFileName);
        fs.writeFileSync(tempFilePath, file.buffer);

        parser = new PDFParse({ url: tempFilePath });

        const result = await parser.getInfo({ parsePageInfo: true });

        fs.unlinkSync(tempFilePath);

        return result.numPages || 1;
      } catch (error) {
        console.error('PDF Parse Error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        throw new BadRequestException(
          `Failed to parse PDF file: ${errorMessage}`,
        );
      } finally {
        if (parser) {
          await parser.destroy();
        }
      }
    }

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
