import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'locsonhg đẹp trai số 1 hà giang',
    description: 'content',
  })
  @IsNotEmpty({ message: 'content is required' })
  @IsString()
  content: string;

  @ApiProperty({
    example: '1',
    description: 'ID bài viết',
  })
  @IsNotEmpty({ message: 'postId is required' })
  @IsInt()
  postId: number;

  @ApiProperty({
    example: '1',
    description: 'ID người dùng',
  })
  @IsNotEmpty({ message: 'accountId is required' })
  @IsInt()
  accountId: number;
}

export class UpdateCommentDto {
  @IsNotEmpty({ message: 'content is required' })
  commentId: number;

  @IsNotEmpty({ message: 'content is required' })
  @IsString()
  content: string;
}

export class CreateReplyCommentDto extends CreateCommentDto {
  @ApiProperty({
    example: '1',
    description: 'ID bình luận cha',
  })
  @IsNotEmpty()
  @IsInt()
  parentId: number; // ID của bình luận cha
}
