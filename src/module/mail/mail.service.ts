import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma.service';
import {
  renderSendMailAuthorPost,
  renderSendMailCommentReply,
  renderResetPasswordMail,
} from './templates/sendMail';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private mailNameMain = process.env.MAIL_USERNAME;

  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async getInforPost(postId: number) {
    const mailPost = await this.prisma.post.findFirst({
      where: { postId },
      include: {
        author: true,
        categories: true,
        comment: true,
      },
    });
    return mailPost;
  }

  // Gửi mail thông báo cho tác giả bài viết khi có người bình luận
  async sendMailAuthorWithNewComment(
    postId: number,
    commenterName: string,
    commentContent: string,
    accountId: number,
  ) {
    const {
      author: { email, userId },
      title,
    } = await this.getInforPost(postId);

    // nếu tài khoản bình luận trùng với tài khoản đăng bài thì không gửi mail
    if (accountId === userId) {
      return;
    }

    const mailOption = {
      from: this.mailNameMain,
      to: email,
      subject: 'Bài viết của bạn có thêm một bình luận mới!',
      html: renderSendMailAuthorPost({
        commentContent,
        commenterName,
        postTitle: title,
      }),
    };

    try {
      const info = await this.transporter.sendMail(mailOption);
      return info;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Gửi mail thông báo cho người bình luận khi có người trả lời bình luận
  async sendMailCommenterWithReplyComment(
    commentId: number,
    replierName: string,
    replyContent: string,
    postId: number,
    accountId: number,
  ) {
    await this.sendMailAuthorWithNewComment(
      postId,
      replierName,
      replyContent,
      accountId,
    );

    // Lấy thông tin của bình luận gốc và người bình luận
    const comment = await this.prisma.comment.findFirst({
      where: { commentId },
      include: {
        author: true, // Lấy thông tin người bình luận
      },
    });

    if (!comment) {
      throw new Error('Không tồn tại bình luận');
    }

    // Nếu tài khoản bình luận trùng với tài khoản trả lời thì không gửi mail
    if (comment.author.userId === accountId) {
      return;
    }

    const {
      author: { email },
      content,
    } = comment;

    const mailOption = {
      from: this.mailNameMain,
      to: email, // Gửi mail cho người đã bình luận
      subject: 'Bình luận của bạn có phản hồi mới!',
      html: renderSendMailCommentReply({
        commentId: comment.commentId,
        content,
        replierName,
        replyContent,
      }),
    };

    try {
      const info = await this.transporter.sendMail(mailOption);
      return info;
    } catch (error) {
      console.error('Error sending email to commenter:', error);
      throw new Error('Failed to send email to commenter');
    }
  }

  // Hàm gửi email OTP đặt lại mật khẩu
  async sendMailResetPassword(email: string, otp: string) {
    const mailOption = {
      from: this.mailNameMain,
      to: email,
      subject: 'Yêu cầu đặt lại mật khẩu',
      html: renderResetPasswordMail({ otp }),
    };

    try {
      const info = await this.transporter.sendMail(mailOption);
      return info;
    } catch (error) {
      console.error('Lỗi khi gửi email đặt lại mật khẩu:', error);
      throw new Error('Không thể gửi email đặt lại mật khẩu');
    }
  }
}
