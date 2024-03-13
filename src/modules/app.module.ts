import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [UserModule, PrismaModule, AuthModule],
})
export class AppModule {}
