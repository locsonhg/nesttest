import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CategoryService } from 'src/module/category/category.service';
import { CategoryDto } from 'src/module/category/dto/category.dto';
import { GetAllCategoryQueryDto } from 'src/module/category/dto/queryCategory.dto';
import { ENUM_PAGINATION } from 'src/utils/enum/defautl.enum';

@ApiTags('Category')
@ApiBearerAuth() // thêm thông tin xác thực Bearer tại swagger
@UseGuards(JwtAuthGuard) // Xác thực tài khoản bằng JWT
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('add')
  @ApiOperation({ summary: 'Thêm mới thể loại' })
  async createCategory(@Body() payload: CategoryDto) {
    return await this.categoryService.createCategory(payload);
  }

  @Get('all')
  @ApiOperation({ summary: 'Lấy danh sách thể loại' })
  async getAllCategory(@Query() query: GetAllCategoryQueryDto) {
    const {
      currentPage = ENUM_PAGINATION.DEFAULT_PAGE,
      pageSize = ENUM_PAGINATION.DEFAULT_PAGE_SIZE,
      keySearch,
    } = query;

    return await this.categoryService.getAllCategory(
      Number(currentPage),
      Number(pageSize),
      keySearch,
    );
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật thông tin thể loại' })
  async updateCategory(@Body() payload: CategoryDto) {
    return await this.categoryService.updateCategory(payload);
  }
}
