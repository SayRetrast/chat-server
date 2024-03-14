import { Module } from '@nestjs/common';
import { RefreshTokenService } from 'src/services/refreshToken.service';

@Module({
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
