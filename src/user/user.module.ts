import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/auth/jwtAuth.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { PrismaService } from 'src/prisma.service';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    UserService,
    JwtAuthGuard,
    JwtService,
    JwtAuthService,
  ],
})
export class UserModule {}
