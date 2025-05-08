import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostDto } from './dto/post.dto';
import {
  TypeResponseError,
  TypeResponseSuccess,
} from 'src/utils/types/typeRespone';
import { Post } from '@prisma/client';
import { HandleUrlImageService } from 'src/services/handleUrlImage.service';
import { CheckAuthorPostService } from 'src/services/checkAuthorPost.service';
import { IDefaultQuery } from 'src/utils/dto/defaultQuery.dto';
import { CreatePostDto } from './dto/create.dto';
import { CommentService } from '../comment/comment.service';
import { Post as PostType } from './type/TypePost';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private checkAuthorPostService: CheckAuthorPostService, // Thêm service kiểm tra quyền sở hữu bài viết
    private commentService: CommentService, // Thêm service quản lý bình luận
  ) {}

  // Tạo mới bài viết
  async createPost(
    payload: CreatePostDto,
    imagePaths: string[],
  ): Promise<TypeResponseSuccess<Post> | TypeResponseError> {
    try {
      const newPost = await this.prisma.post.create({
        data: {
          title: payload.title,
          content: payload.content,
          published: payload.published === 'true',
          accountId: Number(payload.accountId),
          images: HandleUrlImageService.formatImagePaths(imagePaths),
          categories:
            Array.isArray(payload.categories) && payload.categories.length
              ? {
                  connect: payload.categories.map((categoryId) => ({
                    categoryId,
                  })),
                }
              : undefined,
        },
        select: {
          postId: true,
          title: true,
          content: true,
          published: true,
          images: true,
          createdAt: true,
          accountId: true,
          updatedAt: true,
          deletedAt: true,
          categories: {
            select: {
              categoryId: true,
              name: true,
            },
          },
          author: {
            select: {
              name: true,
              userId: true,
            },
          },
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
  async getAllPosts(
    query: IDefaultQuery & {
      categoryId?: number;
      accountId?: number;
    },
  ): Promise<TypeResponseSuccess<Post[]> | TypeResponseError> {
    try {
      // Tạo đối tượng where để xây dựng các điều kiện lọc
      const where: any = {};

      // Thêm điều kiện cho accountId nếu có
      if (query.accountId) {
        where.accountId = query.accountId;
      }

      // Thêm điều kiện cho title nếu có
      if (query.keySearch?.trim()) {
        where.title = { contains: query.keySearch.trim() };
      }

      // Thêm điều kiện cho categories nếu có
      if (query.categoryId) {
        where.categories = {
          some: {
            categoryId: query.categoryId,
          },
        };
      }

      const posts = await this.prisma.post.findMany({
        skip: (query.currentPage - 1) * query.pageSize,
        take: query.pageSize,
        where, // Sử dụng đối tượng where đã xây dựng
        include: {
          author: true, // Bao gồm thông tin tác giả
          categories: true, // Bao gồm danh sách các thể loại
          comment: true, // Bao gồm danh sách các bình luận
        },
        orderBy: { createdAt: 'desc' },
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
      if (
        !this.checkAuthorPostService.checkAuthorPost(payload.postId, userId)
      ) {
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
  ): Promise<TypeResponseSuccess<PostType> | TypeResponseError> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { postId },
        include: {
          author: true, // Bao gồm thông tin tác giả
          categories: true, // Bao gồm danh sách các thể loại
          comment: true, // Bao gồm danh sách các bình luận
        },
      });

      if (!post) {
        return {
          message: 'Không tìm thấy bài viết!',
          status: 404,
        };
      }

      // Chuyển comment sang dạng cây
      const commentTree = this.commentService.buildCommentTree(post.comment);

      return {
        message: 'Lấy thông tin bài viết thành công!',
        data: { ...post, comment: commentTree },
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
