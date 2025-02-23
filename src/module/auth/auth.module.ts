import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from 'src/module/auth/jwtAuth.service';
import { MailService } from '../mail/mail.service';

@Module({
  providers: [
    AuthService,
    PrismaService,
    JwtAuthService,
    JwtService,
    MailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
