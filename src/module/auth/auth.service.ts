import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import * as otpGenerator from 'otp-generator';
import {
  LoginUserDto,
  LoginUserDtoSuccess,
  ResgisterUserDto,
  TypeRegisterError,
  TypeRegisterSuccess,
} from 'src/module/auth/dtos/auth.dto'; // Sửa từ Resgister thành Register
import { JwtAuthService } from 'src/module/auth/jwtAuth.service';
import { PrismaService } from 'src/prisma.service';
import {
  TypeResponseError,
  TypeResponseSuccess,
} from 'src/utils/types/typeRespone';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly mailService: MailService,
  ) {}

  registerUser = async (
    userPayload: ResgisterUserDto,
  ): Promise<TypeRegisterSuccess | TypeRegisterError> => {
    const email = userPayload.email;

    // Kiểm tra nếu đã tồn tại email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    // Đã tồn tại user với email
    if (user) {
      return {
        message: 'Email đã tồn tại',
        status: HttpStatus.BAD_REQUEST,
      };
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
      return {
        message: 'Tạo tài khoản thành công',
        data: res,
        status: HttpStatus.OK,
      };
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

  // service refresh token
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

  // hàm tạo yêu cầu otp lấy thay mật khẩu
  forgotPassword = async (
    email: string,
  ): Promise<TypeResponseSuccess<any> | TypeResponseError> => {
    try {
      // Tìm user theo email
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!user) {
        return {
          message: 'Email không tồn tại!',
          status: HttpStatus.NOT_FOUND,
        };
      }

      // Giới hạn số lần yêu cầu OTP trong 1 ngày
      const MAX_REQUESTS_PER_DAY = 3;
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));

      const requestCount = await this.prismaService.passwordReset.count({
        where: {
          email,
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
      });

      if (requestCount >= MAX_REQUESTS_PER_DAY) {
        return {
          message: 'Bạn đã đạt giới hạn yêu cầu trong ngày',
          status: HttpStatus.TOO_MANY_REQUESTS,
        };
      }

      // Tạo mã OTP
      const OTP_EXPIRATION = 10 * 60 * 1000; // 10 phút
      const otp = otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
      });

      // Cập nhật hoặc tạo mới bản ghi OTP
      await this.prismaService.passwordReset.upsert({
        where: { email },
        update: {
          token: otp,
          expiresAt: new Date(Date.now() + OTP_EXPIRATION),
          createdAt: new Date(), // Cập nhật thời gian tạo
        },
        create: {
          email,
          token: otp,
          expiresAt: new Date(Date.now() + OTP_EXPIRATION),
          createdAt: new Date(),
        },
      });

      await this.mailService.sendMailResetPassword(email, otp);

      return {
        message: 'Yêu cầu đặt lại mật khẩu đã được gửi về email của bạn',
        data: null,
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu quên mật khẩu:', error);
      throw new Error('Có lỗi trong quá trình yêu cầu đặt lại mật khẩu');
    }
  };

  // Hàm kiểm tra OTP và cập nhật mật khẩu mới
  verifyOTPAndResetPassword = async (
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<TypeResponseSuccess<any> | TypeResponseError> => {
    try {
      // Tìm bản ghi OTP
      const otpRecord = await this.prismaService.passwordReset.findUnique({
        where: { email, token: otp },
      });

      // kiểm tra OTP có tồn tại hay không
      if (!otpRecord) {
        return {
          message: 'Mã OTP không hợp lệ',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      // Kiểm tra mã OTP đã hết hạn chưa
      if (new Date() > otpRecord.expiresAt) {
        return {
          message: 'Mã OTP đã hết hạn',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      // Hash mật khẩu mới
      const hashedPassword = await hash(newPassword, 10);

      // Cập nhật mật khẩu mới cho user
      await this.prismaService.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      // Xóa bản ghi OTP
      await this.prismaService.passwordReset.delete({
        where: { email },
      });

      return {
        message: 'Đặt lại mật khẩu thành công!',
        data: null,
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Có lỗi trong quá trình đặt lại mật khẩu');
    }
  };
}
