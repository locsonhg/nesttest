import { Module } from '@nestjs/common';
import { AuthModule } from 'src/module/auth/auth.module';
import { CategoryModule } from 'src/module/category/category.module';
import { UserModule } from 'src/module/user/user.module';
import { PostModule } from './module/post/post.module';
import { MailModule } from './module/mail/mail.module';

// nơi tập trung các module
@Module({
  imports: [AuthModule, UserModule, CategoryModule, PostModule, MailModule],
})
export class AppModule {}
