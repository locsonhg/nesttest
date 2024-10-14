import { Controller, Post, UseGuards, Body, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { PostDto } from './dto/post.dto';

@ApiTags('Post')
@ApiBearerAuth() // thêm thông tin xác thực Bearer tại swagger
@UseGuards(JwtAuthGuard) // Xác thực tài khoản bằng JWT
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('add')
  @ApiOperation({ summary: 'Thêm mới bài viết' })
  async createPost(@Body() payload: PostDto) {
    return await this.postService.createPost(payload);
  }

  @Get('all')
  @ApiOperation({ summary: 'Lấy danh sách bài viết' })
  async getAllPost() {
    return await this.postService.getAllPosts();
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật thông tin bài viết' })
  async updatePost(@Body() payload: PostDto) {
    return await this.postService.updatePost(payload);
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xóa bài viết' })
  async deletePost(@Param('id') id: string) {
    return await this.postService.deletePost(Number(id));
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Chi tiết bài viết' })
  async getPostDetail(@Param('id') id: string) {
    return await this.postService.getPostById(Number(id));
  }
}
