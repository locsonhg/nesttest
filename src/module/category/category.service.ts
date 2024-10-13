import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CategoryDto } from 'src/module/category/dto/category.dto';
import { PrismaService } from 'src/prisma.service';
import {
  TypeResponseError,
  TypeResponseSuccess,
} from 'src/utils/types/typeRespone';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // tạo mới danh mục
  async createCategory(
    payload: CategoryDto,
  ): Promise<TypeResponseSuccess<Category> | TypeResponseError> {
    try {
      const newCategory = await this.prisma.category.create({
        data: {
          ...payload,
          posts: {
            connect: [], // Mảng rỗng, không liên kết bài viết nào
          },
        },
      });
      return {
        message: 'Thêm mới thể loại thành công!',
        data: newCategory,
        status: 201,
      };
    } catch (error) {
      return {
        message: error,
        status: 500,
      };
    }
  }

  // lấy danh sách danh mục
  async getAllCategory(
    currentPage: number,
    pageSize: number,
    keySearch?: string,
  ): Promise<TypeResponseSuccess<Category[]> | TypeResponseError> {
    try {
      const skip = (currentPage - 1) * pageSize;
      const categories = await this.prisma.category.findMany({
        where: {
          deletedAt: null, // Lấy những danh mục chưa bị xóa
          name: {
            contains: keySearch ? keySearch.trim() : '',
          },
        },
        skip: skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      });
      return {
        message: 'Lấy danh sách thể loại thành công',
        data: categories,
        status: 200,
      };
    } catch (error) {
      return {
        message: error,
        status: 500,
      };
    }
  }

  // lấy thông tin danh mục theo id
  async getCategoryById(
    id: number,
  ): Promise<TypeResponseSuccess<Category> | TypeResponseError> {
    try {
      const category = await this.prisma.category.findUnique({
        where: {
          categoryId: id,
        },
      });
      if (!category) {
        return {
          message: 'Thể loại này không tồn tại!',
          status: 404,
        };
      }
      return {
        message: 'Lấy thông tin thể loại thành công',
        data: category,
        status: 200,
      };
    } catch (error) {
      return {
        message: error,
        status: 500,
      };
    }
  }

  // Cập nhật thông tin danh mục
  async updateCategory(
    payload: CategoryDto,
  ): Promise<TypeResponseSuccess<Category> | TypeResponseError> {
    try {
      const { categoryId, posts, ...dataToUpdate } = payload;
      const updatedCategory = await this.prisma.category.update({
        where: {
          categoryId: categoryId,
        },
        data: {
          ...dataToUpdate,
          posts: {
            connect: posts?.map((postId: number) => ({ postId })) || [],
          },
        },
      });
      return {
        message: 'Category updated successfully',
        data: updatedCategory,
        status: 200,
      };
    } catch (error) {
      return {
        message: error,
        status: 500,
      };
    }
  }

  // Xóa danh mục
  async deleteCategory(
    id: number,
  ): Promise<TypeResponseSuccess<Category> | TypeResponseError> {
    try {
      const deletedCategory = await this.prisma.category.update({
        where: {
          categoryId: id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
      return {
        message: 'Xóa thể loại thành công!',
        data: deletedCategory,
        status: 200,
      };
    } catch (error) {
      return {
        message: error,
        status: 500,
      };
    }
  }
}
