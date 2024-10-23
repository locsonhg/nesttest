import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CommentService } from './comment.service';
import {
  CreateCommentDto,
  CreateReplyCommentDto,
} from './dto/createComment.dto';

@ApiTags('Comment')
@ApiBearerAuth() // thêm thông tin xác thực Bearer tại swagger
@UseGuards(JwtAuthGuard) // Xác thực tài khoản bằng JWT
@Controller('Comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post('create')
  async createComment(@Body() payload: CreateCommentDto) {
    return this.commentService.createComment(payload);
  }

  @Post('reply')
  async createReplyComment(@Body() payload: CreateReplyCommentDto) {
    return this.commentService.createSubComment(payload);
  }
}
