import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // Kiểm tra xem Authorization header có tồn tại không
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return true; // Nếu không có token, cho phép tiếp tục
    }
  }
}
