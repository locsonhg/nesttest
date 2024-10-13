import { IsNotEmpty } from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  published: boolean;

  @IsNotEmpty()
  accountId: number;

  @IsNotEmpty()
  categories: number[];

  comment: number[];

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;
}
