import { NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  ValidationPipe,
  ValidationError,
  ExceptionFilter,
} from '@nestjs/common';
import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Explicitly typing ValidationPipe error handling
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]): BadRequestException => {
        return new BadRequestException({
          status: 400,
          message: 'Validation failed',
          errors: errors.map((err) => ({
            field: err.property,
            errors: err.constraints ? Object.values(err.constraints) : [],
          })),
        });
      },
    }),
  );

  // Explicitly casting HttpExceptionFilter
  app.useGlobalFilters(new HttpExceptionFilter() as ExceptionFilter);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // Swagger Configuration
  // const config = new DocumentBuilder()
  //   .setTitle('Task Management API')
  //   .setDescription('API documentation for task management')
  //   .setVersion('1.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api-documentation', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap().catch((err) => {
  console.log(err);
});
