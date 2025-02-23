import { Post as PostType } from '@prisma/client';
import { Comment } from 'src/module/comment/type/TypeCommnet';

export type Post = PostType & {
  comment?: Comment[];
};
