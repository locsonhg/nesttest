import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CreateUserDto, CreateUserResponseDto } from 'src/user/dtos/user.dto';
import { UserService } from 'src/user/user.service';

@ApiTags('Người dùng')
@ApiBearerAuth() // Thêm thông tin xác thực Bearer
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('add')
  createUser(@Body() payload: CreateUserDto): Promise<CreateUserResponseDto> {
    return this.userService.createUser(payload);
  }

  @Get('all')
  getAllUser() {
    return this.userService.getAllUser();
  }
}
