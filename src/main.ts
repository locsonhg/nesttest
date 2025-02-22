import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { json, urlencoded } from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // Cấu hình phục vụ tệp tĩnh
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Cấu hình prefix để truy cập
  });

  const config = new DocumentBuilder()
    .setTitle('edu_api_123')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }) // Thêm Bearer Auth
    .build();

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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Bỏ qua các thuộc tính không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Trả về lỗi nếu có thuộc tính không hợp lệ
      transform: true, // Chuyển đổi payload sang dạng DTO
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => {
          const messages = Object.values(error.constraints);
          return {
            property: error.property,
            messages,
          };
        });

        return new BadRequestException({
          message: 'Có lỗi xác thực xảy ra',
          errors: formattedErrors,
        });
      },
    }),
  );
  await app.listen(4000);
}
bootstrap();
