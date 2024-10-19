import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CheckAuthorPostService {
  constructor(private prisma: PrismaService) {}

  async checkAuthorPost(postId: number, accountId: number): Promise<boolean> {
    const post = await this.prisma.post.findUnique({
      where: {
        postId,
      },
      select: {
        accountId: true,
      },
    });

    return post.accountId === accountId;
  }
}
