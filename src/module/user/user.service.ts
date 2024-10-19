import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import {
  CreateUserDto,
  CreateUserResponseDto,
} from 'src/module/user/dtos/user.dto';
import { PasswordService } from 'src/services/hashPassword.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

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
      data: {
        ...payload,
        password: await this.passwordService.hashPassword(payload.password),
      },
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

  // lấy tất cả thông tin người dùng với phân trang và tìm kiếm theo tên
  async getAllUser(
    currentPage: number,
    pageSize: number,
    keySearch: string,
  ): Promise<User[]> {
    const skip = (currentPage - 1) * pageSize;
    const take = pageSize;

    // chỉ lấy những tài khoản chưa đuợc xoá và tìm kiếm theo tên
    return await this.prisma.user.findMany({
      where: {
        deletedAt: null,
        name: {
          contains: keySearch ? keySearch.trim() : '',
        },
      },
      skip,
      take,
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
      data: {
        ...body,
        password: await this.passwordService.hashPassword(body.password),
      },
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
