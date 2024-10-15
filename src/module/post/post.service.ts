import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostDto } from './dto/post.dto';
import {
  TypeResponseError,
  TypeResponseSuccess,
} from 'src/utils/types/typeRespone';
import { Post } from '@prisma/client';
import { HandleUrlImageService } from 'src/services/handleUrlImage.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  // Tạo mới bài viết
  async createPost(
    payload: PostDto,
    imagePaths: string[],
  ): Promise<TypeResponseSuccess<Post> | TypeResponseError> {
    try {
      // Tạo mới bài viết, kết hợp với danh sách thể loại và bình luận (nếu có)
      const newPost = await this.prisma.post.create({
        data: {
          title: payload.title,
          content: payload.content,
          published: payload.published,
          accountId: payload.accountId, // ID người tạo bài viết
          images: HandleUrlImageService.formatImagePaths(imagePaths), // Đường dẫn ảnh

          // Liên kết với các thể loại (nếu có)
          categories: payload.categories?.length
            ? {
                connect: payload.categories.map((categoryId) => ({
                  categoryId, // Sử dụng categoryId từ payload
                })),
              }
            : undefined,

          // Liên kết với các bình luận (nếu có)
          comment: payload.comment?.length
            ? {
                connect: payload.comment.map((commentId) => ({
                  commentId, // Sử dụng commentId từ payload
                })),
              }
            : undefined,
        },
      });

      return {
        message: 'Thêm mới bài viết thành công!',
        data: newPost,
        status: 201,
      };
    } catch (error) {
      return {
        message: `Có lỗi xảy ra khi tạo bài viết: ${error.message}`,
        status: 500,
      };
    }
  }

  // Lấy danh sách bài viết
  async getAllPosts(): Promise<
    TypeResponseSuccess<Post[]> | TypeResponseError
  > {
    try {
      const posts = await this.prisma.post.findMany({
        include: {
          author: true, // Bao gồm thông tin tác giả
          categories: true, // Bao gồm danh sách các thể loại
          comment: true, // Bao gồm danh sách các bình luận
        },
      });

      return {
        message: 'Lấy danh sách bài viết thành công!',
        data: posts,
        status: 200,
      };
    } catch (error) {
      return {
        message: `Có lỗi xảy ra khi lấy danh sách bài viết: ${error.message}`,
        status: 500,
      };
    }
  }

  // Cập nhật bài viết theo ID
  async updatePost(
    payload: PostDto,
    userId: number,
  ): Promise<TypeResponseSuccess<Post> | TypeResponseError> {
    try {
      // Kiểm tra quyền sở hữu bài viết
      const post = await this.prisma.post.findUnique({
        where: { postId: payload.postId },
      });
      if (!post || post.accountId !== userId) {
        return {
          message: 'Bạn không có quyền cập nhật bài viết này!',
          status: 403,
        };
      }
      const updatedPost = await this.prisma.post.update({
        where: { postId: payload.postId },
        data: {
          title: payload.title,
          content: payload.content,
          published: payload.published,
          accountId: payload.accountId,

          // Cập nhật các thể loại
          categories: payload.categories?.length
            ? {
                set: payload.categories.map((categoryId) => ({
                  categoryId,
                })),
              }
            : undefined,

          // Cập nhật bình luận
          comment: payload.comment?.length
            ? {
                set: payload.comment.map((commentId) => ({
                  commentId,
                })),
              }
            : undefined,
        },
      });

      return {
        message: 'Cập nhật bài viết thành công!',
        data: updatedPost,
        status: 200,
      };
    } catch (error) {
      return {
        message: `Có lỗi xảy ra khi cập nhật bài viết: ${error.message}`,
        status: 500,
      };
    }
  }

  // Xóa bài viết theo ID
  async deletePost(
    postId: number,
  ): Promise<TypeResponseSuccess<null> | TypeResponseError> {
    try {
      await this.prisma.post.delete({
        where: { postId },
      });

      return {
        message: 'Xóa bài viết thành công!',
        data: null,
        status: 200,
      };
    } catch (error) {
      return {
        message: `Có lỗi xảy ra khi xóa bài viết: ${error.message}`,
        status: 500,
      };
    }
  }

  // Lấy thông tin bài viết theo ID
  async getPostById(
    postId: number,
  ): Promise<TypeResponseSuccess<Post> | TypeResponseError> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { postId },
        include: {
          author: true, // Bao gồm thông tin tác giả
          categories: true, // Bao gồm danh sách các thể loại
          comment: true, // Bao gồm danh sách các bình luận
        },
      });

      return {
        message: 'Lấy thông tin bài viết thành công!',
        data: post,
        status: 200,
      };
    } catch (error) {
      return {
        message: `Có lỗi xảy ra khi lấy thông tin bài viết: ${error.message}`,
        status: 500,
      };
    }
  }
}
