import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import { existsSync } from 'fs';
import { MemesService } from './memes.service';
import { Meme } from './meme.interface';

@Controller('memes')
export class MemesController {
  constructor(private readonly memesService: MemesService) {}

  @Get()
  findAll(): Meme[] {
    return this.memesService.findAll();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Use absolute path from app root
          const uploadPath = join(process.cwd(), 'uploads', 'memes');
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    })
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('caption') caption?: string,
    @Body('uploadedBy') uploadedBy?: string
  ): Meme {
    console.log('File uploaded:', {
      filename: file.filename,
      path: file.path,
      destination: file.destination,
    });
    const memeData = {
      filename: file.filename,
      originalName: file.originalname,
      uploadedBy,
      uploadedAt: new Date().toISOString(),
      caption,
    };
    return this.memesService.create(memeData);
  }

  @Get('image/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', 'memes', filename);
    console.log('Attempting to serve image from:', filePath);
    console.log('File exists:', existsSync(filePath));
    
    if (!existsSync(filePath)) {
      return res.status(404).json({ error: 'Image not found', path: filePath });
    }
    
    return res.sendFile(filePath);
  }

  @Get('debug/files')
  async debugFiles() {
    const { readdirSync } = require('fs');
    const uploadPath = join(process.cwd(), 'uploads', 'memes');
    try {
      const files = readdirSync(uploadPath);
      return {
        uploadPath,
        exists: existsSync(uploadPath),
        files,
        count: files.length,
      };
    } catch (error) {
      return {
        uploadPath,
        exists: existsSync(uploadPath),
        error: error.message,
      };
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string): { success: boolean } {
    const success = this.memesService.delete(id);
    return { success };
  }
}
