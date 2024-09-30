import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto, ResgisterUserDto } from 'src/auth/dtos/auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from 'src/guards/optionaJwt.guard';

@ApiTags('Tài khoản')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  register(@Body() userPayload: ResgisterUserDto) {
    return this.authService.registerUser(userPayload);
  }

  @Post('login')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  login(@Body() payload: LoginUserDto) {
    return this.authService.loginUser(payload);
  }

  @Post('refresh')
  @UseGuards(OptionalJwtAuthGuard)
  async refresh(@Body() refreshToken: string) {
    return await this.authService.refreshAccessToken(refreshToken);
  }
}
