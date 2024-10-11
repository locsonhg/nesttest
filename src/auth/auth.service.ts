import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import {
  LoginUserDto,
  LoginUserDtoSuccess,
  ResgisterUserDto,
} from 'src/auth/dtos/auth.dto'; // Sửa từ Resgister thành Register
import { JwtAuthService } from 'src/auth/jwtAuth.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  registerUser = async (userPayload: ResgisterUserDto): Promise<User> => {
    const email = userPayload.email;

    // Kiểm tra nếu đã tồn tại email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    // Đã tồn tại user với email
    if (user) {
      throw new HttpException('Email đã tồn tại', HttpStatus.BAD_REQUEST);
    }

    // Hash password trước khi lưu vào db
    const hashedPassword = await hash(userPayload.password, 10);

    try {
      const res = await this.prismaService.user.create({
        data: {
          ...userPayload,
          password: hashedPassword,
        },
      });
      return res;
    } catch (err) {
      // Ném lại ngoại lệ nếu có lỗi khi tạo người dùng
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };

  // service login
  loginUser = async (payload: LoginUserDto): Promise<LoginUserDtoSuccess> => {
    const user = await this.prismaService.user.findUnique({
      where: {
        userName: payload.userName,
      },
    });
    // Kiểm tra nếu không tồn tại user
    if (!user) {
      throw new HttpException(
        'Tài khoản không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }
    // So sánh password đã hash với password người dùng nhập vào
    const isPassword = await compare(payload.password, user.password);
    if (!isPassword) {
      throw new HttpException('Mật khẩu không đúng', HttpStatus.BAD_REQUEST);
    }

    // Tạo token và refresh token
    const token = this.jwtAuthService.generateAccessToken(user);
    const refreshToken = this.jwtAuthService.generateRefreshToken(user);

    return {
      message: 'Đăng nhập thành công',
      data: {
        ...user,
        token,
        refreshToken,
      },
      status: HttpStatus.OK,
    };
  };

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let decoded;
    try {
      // Xác thực refresh token
      decoded = this.jwtAuthService.verifyToken(refreshToken);
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    // Lấy thông tin người dùng từ database bằng userId đã được giải mã từ refresh token
    const user = await this.prismaService.user.findUnique({
      where: { userId: decoded.userId },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    // Tạo access token và refresh token mới
    const accessToken = this.jwtAuthService.generateAccessToken(user);
    const newRefreshToken = this.jwtAuthService.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
