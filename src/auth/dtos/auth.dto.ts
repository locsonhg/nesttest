import { HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResgisterUserDto {
  @IsNotEmpty({
    message: 'Tên đăng nhập không được để trống',
    context: { errorCode: HttpStatus.BAD_REQUEST },
  })
  userName: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MaxLength(20, { message: 'Mật khẩu không được quá 20 ký tự' })
  @MinLength(6, { message: 'Mật khẩu không được ít hơn 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail()
  email: string;

  age?: number;

  @IsOptional() // Thêm decorator này để bỏ qua kiểm tra nếu không có giá trị
  @Matches(/^[0-9]{10}$/, {
    message: 'Số điện thoại phải có đúng 10 chữ số và chỉ chứa các số',
  })
  phone?: string;

  @IsNotEmpty({ message: 'Tên không được để trống' })
  @MaxLength(20)
  name: string;
}

export class LoginUserDto {
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  userName: string;
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}

export class LoginUserDtoSuccess {
  message: string;
  data: User & { token: string; refreshToken: string };
  status: number;
}
