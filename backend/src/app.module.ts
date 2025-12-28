import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { QuotesModule } from './quotes/quotes.module';
import { ExamsModule } from './exams/exams.module';
import { TasksModule } from './tasks/tasks.module';
import { MemesModule } from './memes/memes.module';

@Module({
  imports: [
    // Serve Angular frontend from root
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*', '/uploads*'],
    }),
    // Serve uploaded files from app root
    ServeStaticModule.forRoot({
      rootPath: process.env.UPLOADS_DIR || join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    QuotesModule,
    ExamsModule,
    TasksModule,
    MemesModule,
  ],
})
export class AppModule {}
