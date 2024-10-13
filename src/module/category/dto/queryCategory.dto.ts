import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ENUM_PAGINATION } from 'src/utils/enum/defautl.enum';

export class GetAllCategoryQueryDto {
  @ApiProperty({
    required: false, // không bắt buộc
    default: ENUM_PAGINATION.DEFAULT_PAGE, // giá trị mặc định
    description: 'Số trang hiện tại',
  })
  @IsOptional()
  @IsString()
  currentPage?: string;

  @ApiProperty({
    required: false, // không bắt buộc
    default: ENUM_PAGINATION.DEFAULT_PAGE_SIZE, // giá trị mặc định
    description: 'Số mục mỗi trang',
  })
  @IsOptional()
  @IsString()
  pageSize?: string;

  @ApiProperty({
    required: false, // không bắt buộc
    description: 'Từ khóa tìm kiếm',
  })
  @IsOptional()
  @IsString()
  keySearch?: string;
}
