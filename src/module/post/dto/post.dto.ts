import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class PostDto {
  @ApiProperty({
    example: 1,
    description: 'ID bài viết',
  })
  @IsOptional() // Cho phép bỏ qua ID bài viết
  postId: number;

  @ApiProperty({
    example: 'Ảnh đại diện',
    description: 'Ảnh đại diện bài viết',
  })
  @IsOptional() // Cho phép bỏ qua ảnh đại diện
  images: string;

  @ApiProperty({ example: 'Tiêu đề bài viết', description: 'Tiêu đề bài viết' })
  @IsOptional() // Optional cho phép trường này không bắt buộc
  title: string;

  @ApiProperty({
    example: 'Nội dung bài viết',
    description: 'Nội dung bài viết',
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: true,
    description: 'Bài viết ở trạng thái công khai',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true) // Chuyển đổi giá trị về boolean
  published: boolean;

  @ApiProperty({ example: 1, description: 'ID tài khoản' })
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10)) // Chuyển đổi chuỗi về số nguyên
  accountId: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Danh sách thể loại',
  })
  @IsOptional() // Cho phép bỏ qua danh sách thể loại
  categories: number[];

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Danh sách bình luận',
  })
  @IsOptional() // Cho phép bỏ qua danh sách bình luận
  comment: number[];

  @IsOptional() // Không cần nhập thời gian tạo
  createdAt: Date;

  @IsOptional() // Không cần nhập thời gian cập nhật
  updatedAt: Date;

  @IsOptional() // Có thể bỏ qua thời gian xóa
  deletedAt?: Date;
}
