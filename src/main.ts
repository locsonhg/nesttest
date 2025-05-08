import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'src/app.module';
import { json, urlencoded } from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { config } from './config/Swagger.service';
import { configPipe } from './config/ValidationPipe.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // Cấu hình phục vụ tệp tĩnh
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Cấu hình prefix để truy cập
  });

  // Tạo tài liệu Swagger
  const document = SwaggerModule.createDocument(app, config);

  // Cài đặt Swagger với đường dẫn cụ thể
  SwaggerModule.setup('api/docs', app, document);

  // Cấu hình body parser nếu cần
  app.use(json({ limit: '10mb' })); // Ví dụ: giới hạn kích thước body JSON
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // // Sử dụng global guard check auth
  // app.useGlobalGuards(new JwtAuthGuard(app.get(JwtService)));

  // Sử dụng middleware logger
  // app.use(logger);

  // Cài đặt ValidationPipe cho từng request
  app.useGlobalPipes(configPipe);
  await app.listen(4000);
}
bootstrap();
