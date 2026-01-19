import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { FilesService } from './files.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('🔼 Upload request received:', {
      originalName: file?.originalname,
      size: file?.size,
      mimetype: file?.mimetype,
    });

    const result = await this.filesService.uploadFile(file);

    console.log('📤 Upload result:', {
      fileName: result.fileName,
      pages: result.pages,
      mimeType: result.mimeType,
    });

    return {
      statusCode: HttpStatus.CREATED,
      data: result,
    };
  }

  @Public()
  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.filesService.getFilePath(filename);
    const mimeType = this.filesService.getMimeType(filename);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    return res.sendFile(filePath);
  }
}
