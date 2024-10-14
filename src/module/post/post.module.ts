import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService } from '../auth/jwtAuth.service';

@Module({
  controllers: [PostController],
  providers: [PrismaService, PostService, JwtService, JwtAuthService],
})
export class PostModule {}
