import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { JwtAuthService } from 'src/module/auth/jwtAuth.service';
import { CategoryController } from 'src/module/category/category.controller';
import { CategoryService } from 'src/module/category/category.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    JwtAuthGuard,
    PrismaService,
    JwtAuthService,
    JwtService,
  ],
})
export class CategoryModule {}
