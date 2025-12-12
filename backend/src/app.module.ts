import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { QuotesModule } from './quotes/quotes.module';
import { ExamsModule } from './exams/exams.module';
import { TasksModule } from './tasks/tasks.module';
import { MemesModule } from './memes/memes.module';

@Module({
  imports: [
    // Serve frontend static files (Angular build)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist', 'shak-site', 'browser'),
      exclude: ['/api*', '/uploads*'],
    }),
    // Serve uploaded files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    QuotesModule,
    ExamsModule,
    TasksModule,
    MemesModule,
  ],
})
export class AppModule {}
