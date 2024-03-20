import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';
import { MessageModule } from './message.module';

@Module({
  imports: [UserModule, PrismaModule, AuthModule, MessageModule],
})
export class AppModule {}
