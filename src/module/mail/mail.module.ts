import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [MailService, PrismaService],
  exports: [MailService],
})
export class MailModule {}
