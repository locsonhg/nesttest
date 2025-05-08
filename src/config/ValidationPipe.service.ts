import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const configPipe = new ValidationPipe({
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
});
