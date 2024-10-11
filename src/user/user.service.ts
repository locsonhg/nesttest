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

  // lấy thông tin của người dùng theo userId
  async getUserById(id: number): Promise<User> {
    if (!id) {
      throw new HttpException('ID không hợp lệ', 400);
    }
    const user = await this.prisma.user.findFirst({
      where: {
        userId: id,
      },
    });
    if (!user) {
      throw new HttpException('Người dùng không tồn tại', 404);
    }
    return user;
  }

  // lấy tất cả thông tin người dùng
  async getAllUser(): Promise<User[]> {
    // chỉ lấy những tài khoản chưa đuợc xoá
    return await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  // update người dùng theo id
  async updateUser(body: CreateUserDto): Promise<CreateUserResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        userId: body.userId,
      },
    });
    if (!user) {
      throw new HttpException('Người dùng không tồn tại', 404);
    }
    const update = await this.prisma.user.update({
      where: {
        userId: body.userId,
      },
      data: body,
    });
    return {
      message: 'Cập nhật người dùng thành công',
      data: update,
      status: 200,
    };
  }

  // xoá người dùng theo id
  async deleteUser(id: number): Promise<CreateUserResponseDto> {
    try {
      if (!id) {
        throw new HttpException('ID không hợp lệ', 400);
      }
      const user = await this.prisma.user.findFirst({
        where: {
          userId: id,
        },
      });

      if (!user) {
        throw new HttpException('Người dùng không tồn tại', 404);
      }

      await this.prisma.user.update({
        where: {
          userId: id,
        },
        data: {
          ...user,
          deletedAt: new Date(),
        },
      });

      return {
        message: 'Xoá người dùng thành công',
        data: null,
        status: 200,
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
