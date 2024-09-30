import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtAuthService } from 'src/auth/jwtAuth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AuthService, PrismaService, JwtAuthService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
