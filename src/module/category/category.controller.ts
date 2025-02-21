import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CategoryService } from 'src/module/category/category.service';
import { CategoryDto } from 'src/module/category/dto/category.dto';
import { DefaultQueryDto } from 'src/utils/dto/defaultQuery.dto';
import { ENUM_PAGINATION } from 'src/utils/enum/defautl.enum';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiBearerAuth() // thêm thông tin xác thực Bearer tại swagger
  @UseGuards(JwtAuthGuard) // Xác thực tài khoản bằng JWT
  @Post('add')
  @ApiOperation({ summary: 'Thêm mới thể loại' })
  async createCategory(@Body() payload: CategoryDto) {
    return await this.categoryService.createCategory(payload);
  }

  @Get('all')
  @ApiOperation({ summary: 'Lấy danh sách thể loại' })
  async getAllCategory(@Query() query: DefaultQueryDto) {
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

  @ApiBearerAuth() // thêm thông tin xác thực Bearer tại swagger
  @UseGuards(JwtAuthGuard) // Xác thực tài khoản bằng JWT
  @Post('update')
  @ApiOperation({ summary: 'Cập nhật thông tin thể loại' })
  async updateCategory(@Body() payload: CategoryDto) {
    return await this.categoryService.updateCategory(payload);
  }

  @ApiBearerAuth() // thêm thông tin xác thực Bearer tại swagger
  @UseGuards(JwtAuthGuard) // Xác thực tài khoản bằng JWT
  @Post('delete')
  @ApiOperation({ summary: 'Xóa thể loại' })
  async deleteCategory(@Param('id') id: string) {
    return await this.categoryService.deleteCategory(Number(id));
  }
}
