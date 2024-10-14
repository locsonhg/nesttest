import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { PostDto } from './dto/post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { File as MulterFile } from 'multer';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Post')
@ApiBearerAuth() // thêm thông tin xác thực Bearer tại swagger
@UseGuards(JwtAuthGuard) // Xác thực tài khoản bằng JWT
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('add')
  @ApiOperation({ summary: 'Thêm mới bài viết với ảnh' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        postId: { type: 'integer' },
        title: { type: 'string' },
        content: { type: 'string' },
        published: { type: 'boolean' },
        accountId: { type: 'integer' },
        categories: { type: 'array', items: { type: 'integer' } },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads', // Đường dẫn thư mục lưu ảnh
        filename: (req, file, cb) => {
          const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  async createPost(
    @UploadedFiles() files: Array<MulterFile>, // Nhận file ảnh
    @Body() postDto: PostDto,
  ) {
    // Lấy danh sách đường dẫn ảnh đã upload
    const imagePaths = files.map((file) => file.path);

    // Gửi dữ liệu bài viết và đường dẫn ảnh tới service
    return await this.postService.createPost(postDto, imagePaths);
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
