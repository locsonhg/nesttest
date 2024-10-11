import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthService } from 'src/auth/jwtAuth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtAuthService: JwtAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Bạn chưa đăng nhập');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token không tồn tại');
    }

    const decoded = await this.jwtAuthService.verifyToken(token); // Giải mã token
    if (!decoded) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }

    request.user = decoded; // Lưu thông tin người dùng vào request
    return true; // Cho phép truy cập
  }
}
