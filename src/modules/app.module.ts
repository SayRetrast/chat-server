import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';
import { MessageModule } from './message.module';
import { DialogModule } from './dialog.module';

@Module({
  imports: [UserModule, PrismaModule, AuthModule, MessageModule, DialogModule],
})
export class AppModule {}
