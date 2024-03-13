import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [UserModule, PrismaModule],
})
export class AppModule {}
