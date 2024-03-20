import { Module } from '@nestjs/common';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { UserModule } from './user.module';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenModule } from './refreshToken.module';

@Module({
  imports: [UserModule, JwtModule.register({ global: true }), RefreshTokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
