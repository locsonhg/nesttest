import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { DefaultQueryDto } from 'src/utils/dto/defaultQuery.dto';

export class PostQueryDto extends DefaultQueryDto {
  @ApiProperty({
    required: false,
    description: 'thể loại của bài viết',
    type: Number,
  })
  @IsOptional()
  categoryId: number;

  @ApiProperty({
    required: false,
    description: 'tài khoản tạo bài viết',
    type: Number,
  })
  @IsOptional()
  accountId: number;
}
