import { Injectable } from '@nestjs/common';
import { CategoryDto } from 'src/module/category/dto/category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // tạo mới danh mục
  async createCategory(payload: CategoryDto): Promise<CategoryDto> {
    return await this.prisma.category.create({
      data: {
        ...payload,
        posts: {
          connect: [], // Mảng rỗng, không liên kết bài viết nào
        },
      },
    });
  }

  // lấy danh sách danh mục
  async getAllCategory(
    currentPage: number,
    pageSize: number,
    keySearch?: string,
  ): Promise<CategoryDto[]> {
    const skip = (currentPage - 1) * pageSize;
    return await this.prisma.category.findMany({
      where: {
        name: {
          contains: keySearch.trim() || '',
        },
      },
      skip: skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });
  }
}
