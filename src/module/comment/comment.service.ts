import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MailService } from '../mail/mail.service';
import {
  CreateCommentDto,
  CreateReplyCommentDto,
} from './dto/createComment.dto';
import { TypeResponseSuccess } from 'src/utils/types/typeRespone';
import { Comment } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  // tạo 1 bình luận mới vào 1 bài viết
  async createComment(
    payload: CreateCommentDto,
  ): Promise<TypeResponseSuccess<Comment> | TypeError> {
    const { postId, content, accountId } = payload;

    // lấy thông tin tài khoản của người bình luận
    const authorComment = await this.prisma.user.findUnique({
      where: {
        userId: accountId, // ví dụ userId: 1
      },
    });

    const newComment = await this.prisma.comment.create({
      data: {
        content: content,
        post: {
          connect: { postId }, // Liên kết bình luận với bài viết
        },
        author: {
          connect: { userId: accountId }, // Liên kết bình luận với người dùng (ví dụ userId: 1)
        },
      },
      include: {
        post: true,
        author: true,
        replies: true,
      },
    });

    await this.mailService.sendMailAuthorWithNewComment(
      postId,
      authorComment?.name,
      content,
      accountId,
    );

    return {
      message: 'Thêm mới bình luận thành công!',
      data: newComment,
      status: 201,
    };
  }

  // tạo 1 bình luận mới vào 1 bình luận
  async createSubComment(
    payload: CreateReplyCommentDto,
  ): Promise<TypeResponseSuccess<Comment> | TypeError> {
    const { accountId, content, parentId, postId } = payload;

    // Kiểm tra xem bình luận cha có tồn tại không
    const parentComment = await this.prisma.comment.findUnique({
      where: {
        commentId: parentId, // Truy vấn bình luận cha dựa vào parentId
      },
      include: {
        author: true,
      },
    });

    if (!parentComment) {
      throw new Error('Parent comment not found');
    }

    // Tạo một bình luận con mới và kết nối với bình luận cha
    const newSubComment = await this.prisma.comment.create({
      data: {
        content: content,
        post: {
          connect: { postId }, // Kết nối bình luận với bài viết
        },
        author: {
          connect: { userId: accountId }, // Kết nối với tác giả của bình luận
        },
        parent: {
          connect: { commentId: parentComment.commentId }, // Kết nối bình luận con với bình luận cha
        },
      },
      include: {
        post: true,
        author: true,
        parent: true, // Bao gồm thông tin của bình luận cha
      },
    });

    const parentAuthor = parentComment.author;
    const replierName = parentAuthor.name;

    // Gửi mail thông báo cho người tạo bình luận cha
    await this.mailService.sendMailCommenterWithReplyComment(
      parentComment.commentId,
      replierName,
      content,
      postId,
      accountId,
    );

    return {
      message: 'Thêm mới bình luận thành công!',
      data: newSubComment,
      status: 201,
    };
  }
}
