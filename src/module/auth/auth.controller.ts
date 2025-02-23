import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from 'src/module/auth/auth.service';
import {
  BodyRequestOTP,
  BodyResetPassword,
  LoginUserDto,
  ResgisterUserDto,
} from 'src/module/auth/dtos/auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from 'src/guards/optionaJwt.guard';
import { loggingInterceptor } from 'src/interceptor/logging.interceptor';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(loggingInterceptor)
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

  @Post('request-otp')
  async requestOTP(@Body() body: BodyRequestOTP) {
    return await this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() payload: BodyResetPassword) {
    const { email, otp, newPassword } = payload;
    return await this.authService.verifyOTPAndResetPassword(
      email,
      otp,
      newPassword,
    );
  }
}
