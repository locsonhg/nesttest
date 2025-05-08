import { DocumentBuilder } from '@nestjs/swagger';

// đường dẫn : localhost:4000/api/docs
export const config = new DocumentBuilder()
  .setTitle('edu_api')
  .setDescription('The API description')
  .setVersion('1.0')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }) // Thêm Bearer Auth
  .build();
