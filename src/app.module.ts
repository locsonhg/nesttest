import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

// nơi tập trung các module
@Module({
  imports: [AuthModule, UserModule],
})
export class AppModule {}
