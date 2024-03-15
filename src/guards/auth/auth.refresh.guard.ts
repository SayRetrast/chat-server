import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtendedRequest } from 'src/interfaces/extendedRequest.interface';
import { RefreshTokenService } from 'src/services/refreshToken.service';
import { UserService } from 'src/services/user.service';

@Injectable()
export class AuthRefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: ExtendedRequest = context.switchToHttp().getRequest();
    const refreshToken: string | undefined = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Could not find refreshToken in the cookies.');
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      });
    } catch {
      throw new UnauthorizedException('RefreshToken is invalid.');
    }

    const dbRefreshToken = await this.refreshTokenService.findToken(refreshToken);
    if (!dbRefreshToken) {
      throw new UnauthorizedException('RefreshToken is not found in the database.');
    }

    const userId = dbRefreshToken.userId;
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new InternalServerErrorException('User with such id is not found.');
    }
    req.user = { userId: user.userId, username: user.username };

    return true;
  }
}
