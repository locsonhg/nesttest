import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/module/auth/jwtAuth.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { PrismaService } from 'src/prisma.service';
import { UserController } from 'src/module/user/user.controller';
import { UserService } from 'src/module/user/user.service';
import { PasswordService } from 'src/services/hashPassword.service';

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    UserService,
    JwtAuthGuard,
    JwtService,
    JwtAuthService,
    PasswordService,
  ],
})
export class UserModule {}
