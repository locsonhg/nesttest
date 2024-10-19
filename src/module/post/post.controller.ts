import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFiles,
  Request,
  Query,
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
import { ENUM_PAGINATION } from 'src/utils/enum/defautl.enum';
import { PostQueryDto } from './dto/postQuery.dto';
import { CreatePostDto } from './dto/create.dto';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @ApiBearerAuth() // thêm thông tin xác thực Bearer tại swagger
  @UseGuards(JwtAuthGuard) // Xác thực tài khoản bằng JWT
  @Post('add')
  @ApiOperation({ summary: 'Thêm mới bài viết với ảnh' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePostDto })
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
    @Body() createPostDto: CreatePostDto & PostDto,
  ) {
    // Lấy danh sách đường dẫn ảnh đã upload
    const imagePaths = files.map((file) => file.path);

    if (typeof createPostDto.categories === 'string') {
      createPostDto.categories = createPostDto.categories
        .split(',')
        .map(Number)
        .filter(Number.isInteger);
    }
    return await this.postService.createPost(createPostDto, imagePaths);
  }

  @Get('all')
  @ApiOperation({ summary: 'Lấy danh sách bài viết' })
  async getAllPost(@Query() query: PostQueryDto) {
    const {
      currentPage = ENUM_PAGINATION.DEFAULT_PAGE,
      pageSize = ENUM_PAGINATION.DEFAULT_PAGE_SIZE,
      keySearch,
      categoryId,
      accountId,
    } = query;
    return await this.postService.getAllPosts({
      currentPage: Number(currentPage),
      pageSize: Number(pageSize),
      keySearch,
      categoryId: Number(categoryId),
      accountId: Number(accountId),
    });
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật thông tin bài viết' })
  async updatePost(@Body() payload: PostDto, @Request() req: any) {
    const userId = req.userId; // Lấy userId từ request
    return await this.postService.updatePost(payload, userId);
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
