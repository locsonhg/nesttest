import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CreateUserDto, CreateUserResponseDto } from 'src/user/dtos/user.dto';
import { UserService } from 'src/user/user.service';

@ApiTags('User')
@ApiBearerAuth() // Thêm thông tin xác thực Bearer
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  @ApiOperation({ summary: 'Danh sách người dùng' })
  getAllUser() {
    return this.userService.getAllUser();
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
