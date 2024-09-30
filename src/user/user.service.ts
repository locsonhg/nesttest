import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, CreateUserResponseDto } from 'src/user/dtos/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // tạo mới người dùng
  createUser = async (
    payload: CreateUserDto,
  ): Promise<CreateUserResponseDto> => {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: payload.email }, { userName: payload.userName }],
      },
    });
    // check useName và email đã tồn tại chưa
    if (user) {
      throw new HttpException('Email hoặc tên người dùng đã tồn tại', 400);
    }

    // tạo 1 người dùng mới vào database
    const create = await this.prisma.user.create({
      data: payload,
    });

    return {
      message: 'Thêm mới người dùng thành công',
      data: create,
      status: 200,
    };
  };

  // lấy tất cả thông tin người dùng
  async getAllUser(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }
}
