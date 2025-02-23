import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from '../auth/jwtAuth.service';
import { CheckAuthorPostService } from 'src/services/checkAuthorPost.service';
import { CommentService } from '../comment/comment.service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [PostController],
  providers: [
    PrismaService,
    PostService,
    JwtService,
    JwtAuthService,
    CheckAuthorPostService,
    CommentService,
    MailService,
  ],
})
export class PostModule {}
