import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsIntString } from 'src/utils/pipes/isStringPipe';

export class CreateUserDto {
  @ApiProperty({ example: 1, description: 'ID người dùng' })
  @IsOptional()
  userId: number;

  @ApiProperty({ example: 'locsonhg', description: 'Tên đăng nhập' })
  @IsNotEmpty({ message: 'Tên đăng nhập là bắt buộc' })
  @MaxLength(20, { message: 'Tên đăng nhập không được vượt quá 20 ký tự' })
  @MinLength(6, { message: 'Tên đăng nhập không được ít hơn 6 ký tự' })
  userName: string;

  @ApiProperty({ example: 'locsonhgson@gmail.com', description: 'Email' })
  @IsNotEmpty({ message: 'Email là bắt buộc' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: 'Sơn đẹp trai', description: 'Tên người dùng' })
  @IsNotEmpty({ message: 'Tên người dùng là bắt buộc' })
  name: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu' })
  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  @MinLength(6, { message: 'Mật khẩu không được ít hơn 6 ký tự' })
  @MaxLength(20, { message: 'Mật khẩu không được vượt quá 20 ký tự' })
  password: string;

  @ApiProperty({ example: '0123456789', description: 'Số điện thoại' })
  @IsOptional()
  @Matches(/^(0)[0-9]{9}$/, { message: 'Số điện thoại không hợp lệ' })
  phone?: string;

  @ApiProperty({ example: 25, description: 'Tuổi' })
  @IsIntString({ message: 'Tuổi phải là một số nguyên' })
  age?: number;
}

export class CreateUserResponseDto {
  message: string;
  data: User;
  status: number;
}
