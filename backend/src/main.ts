import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS - allow frontend origin
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? [
          process.env.FRONTEND_URL || 'https://lobster-app-vfvxz.ondigitalocean.app',
          'https://lobster-app-vfvxz.ondigitalocean.app'
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
}
bootstrap();
