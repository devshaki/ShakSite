import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
        destination: './uploads/memes',
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
    const memeData = {
      filename: file.filename,
      originalName: file.originalname,
      uploadedBy,
      uploadedAt: new Date().toISOString(),
      caption,
    };
    return this.memesService.create(memeData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): { success: boolean } {
    const success = this.memesService.delete(id);
    return { success };
  }
}
