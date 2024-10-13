import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CategoryDto {
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ example: 'Reactjs', description: 'Tên thể loại sách' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Reactjs là một thư viện JavaScript phổ biến',
    description: 'Mô tả thể loại sách',
  })
  @IsNotEmpty()
  description: string;

  @IsOptional()
  posts?: number[];

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  deletedAt?: Date;
}
