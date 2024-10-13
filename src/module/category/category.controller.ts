import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CategoryService } from 'src/module/category/category.service';
import { CategoryDto } from 'src/module/category/dto/category.dto';
import { ENUM_PAGINATION } from 'src/utils/enum/defautl.enum';

@ApiTags('Category')
@ApiBearerAuth() // thêm thông tin xác thực Bearer tại swagger
@UseGuards(JwtAuthGuard) // Xác thực tài khoản bằng JWT
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('add')
  @ApiOperation({ summary: 'Thêm mới thể loại' })
  async createCategory(@Body() payload: CategoryDto): Promise<CategoryDto> {
    return await this.categoryService.createCategory(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thể loại' })
  async getAllCategory(
    @Query('currentPage') currentPage: number = ENUM_PAGINATION.DEFAULT_PAGE, // Mặc định là trang 1
    @Query('pageSize') pageSize: number = ENUM_PAGINATION.DEFAULT_PAGE_SIZE, // Mặc định là 10 mục mỗi trang
    @Query('keySearch') keySearch?: string,
  ): Promise<CategoryDto[]> {
    return await this.categoryService.getAllCategory(
      currentPage,
      pageSize,
      keySearch,
    );
  }
}
