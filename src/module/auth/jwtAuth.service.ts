import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(user: User) {
    return this.jwtService.sign(
      user, // Chỉ định rõ ràng thông tin muốn mã hóa
      {
        secret: process.env.JWT_SECRET, // Sử dụng biến môi trường cho secret
        expiresIn: '15m', // Thời gian sống của access token
      },
    );
  }

  generateRefreshToken(user: User) {
    return this.jwtService.sign(
      user, // Chỉ định rõ ràng thông tin muốn mã hóa
      {
        secret: process.env.JWT_REFRESH_SECRET, // Sử dụng biến môi trường cho refresh secret
        expiresIn: '7d', // Thời gian sống của refresh token
      },
    );
  }

  async verifyToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET, // Sử dụng biến môi trường cho secret
      });
      return decoded; // Trả về thông tin đã giải mã nếu thành công
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        // Nếu token đã hết hạn, xử lý lỗi tại đây
        throw new UnauthorizedException('Token đã hết hạn');
      }
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }
}
