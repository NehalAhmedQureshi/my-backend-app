import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Allow your Next.js frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // 1. Create the Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('The official API documentation for the Task Manager app')
    .setVersion('1.0')
    .addBearerAuth() // IMPORTANT: This allows developers to paste their JWT token
    .build();

  // 2. Create the Document
  const document = SwaggerModule.createDocument(app, config);

  // 3. Setup the route (e.g., http://localhost:3000/api)
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();