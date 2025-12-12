import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Ensure uploads directory exists
  const uploadsPath = join(process.cwd(), 'uploads', 'memes');
  if (!existsSync(uploadsPath)) {
    mkdirSync(uploadsPath, { recursive: true });
    console.log(`📁 Created uploads directory at ${uploadsPath}`);
  }

  // Enable CORS - allow frontend origin
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? [
          process.env.FRONTEND_URL ||
            'https://lobster-app-vfvxz.ondigitalocean.app',
          'https://lobster-app-vfvxz.ondigitalocean.app',
        ]
      : ['http://localhost:4200'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Use PORT env variable for deployment platforms
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend server running on port ${port}`);
  console.log(`📁 Serving frontend from root`);
  console.log(`🔌 API available at /api`);
  console.log(`📂 Uploads directory: ${uploadsPath}`);
  console.log(`📂 Static uploads served from: ${join(process.cwd(), 'uploads')}`);
}
bootstrap();
