import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import {
  CreateUserDto,
  CreateUserResponseDto,
} from 'src/module/user/dtos/user.dto';
import { UserService } from 'src/module/user/user.service';
import { DefaultQueryDto } from 'src/utils/dto/defaultQuery.dto';
import { ENUM_PAGINATION } from 'src/utils/enum/defautl.enum';

@ApiTags('User')
@ApiBearerAuth() // Thêm thông tin xác thực Bearer
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  @ApiOperation({ summary: 'Danh sách người dùng' })
  getAllUser(@Query() query: DefaultQueryDto) {
    const {
      currentPage = ENUM_PAGINATION.DEFAULT_PAGE,
      pageSize = ENUM_PAGINATION.DEFAULT_PAGE_SIZE,
      keySearch,
    } = query;
    return this.userService.getAllUser(
      Number(currentPage),
      Number(pageSize),
      keySearch,
    );
  }

  @Post('add')
  @ApiOperation({ summary: 'Thêm mới người dùng' })
  createUser(@Body() payload: CreateUserDto): Promise<CreateUserResponseDto> {
    return this.userService.createUser(payload);
  }

  @Post('update')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  updateUser(@Body() payload: CreateUserDto) {
    return this.userService.updateUser(payload);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Xoá người dùng' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the user' })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(Number(id));
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the user' })
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(Number(id));
  }
}
