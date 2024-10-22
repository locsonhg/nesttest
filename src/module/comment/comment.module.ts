import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { PrismaService } from 'src/prisma.service';
import { JwtAuthService } from '../auth/jwtAuth.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [CommentController],
  providers: [
    CommentService,
    JwtAuthGuard,
    PrismaService,
    JwtAuthService,
    JwtService,
    MailService,
  ],
})
export class CommentModule {}
