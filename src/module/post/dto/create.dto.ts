import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  title: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  content: string;

  @ApiProperty({
    example: true,
    description: 'Bài viết ở trạng thái công khai',
    type: 'boolean',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true) // Chuyển đổi giá trị về boolean
  published: boolean | string;

  @ApiProperty({ example: 1, description: 'ID tài khoản', type: 'integer' })
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10)) // Chuyển đổi chuỗi về số nguyên
  accountId: number | string;

  @ApiProperty({ type: 'array', items: { type: 'integer' } })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true }) // Kiểm tra mỗi phần tử của mảng là số nguyên
  categories: number[] | string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true }) // Kiểm tra mỗi phần tử của mảng là chuỗi
  images?: string[];
}
