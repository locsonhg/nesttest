import { Comment as PrismaComment } from '@prisma/client';

// bình luận
export type Comment = PrismaComment & {
  children?: Comment[];
};
