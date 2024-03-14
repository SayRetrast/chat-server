import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtendedRequest } from 'src/interfaces/extendedRequest.interface';
import { PayloadAccess } from 'src/interfaces/payloadAccess.interface';
import { RefreshTokenService } from 'src/services/refreshToken.service';
import { UserService } from 'src/services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: ExtendedRequest = context.switchToHttp().getRequest();
    const accessToken = this.extractAccessTokenFromHeader(req);
    if (!accessToken) {
      throw new UnauthorizedException('Could not find accessToken in the authorization header.');
    }

    try {
      const payloadAccess: PayloadAccess = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      });
      req.user = { userId: payloadAccess.sub, username: payloadAccess.username };
    } catch {
      const cookieRefreshToken: string | undefined = req.cookies['refreshToken'];
      if (!cookieRefreshToken) {
        throw new UnauthorizedException('Could not find refreshToken in the cookies.');
      }

      const dbRefreshToken = await this.refreshTokenService.findToken(cookieRefreshToken);
      if (!dbRefreshToken) {
        throw new UnauthorizedException('Could not find refreshToken in the database.');
      }

      try {
        await this.jwtService.verifyAsync(dbRefreshToken.refreshToken, {
          secret: process.env.REFRESH_TOKEN_SECRET_KEY,
        });

        const user = await this.userService.findUserById(dbRefreshToken.userId);
        if (!user) {
          throw new InternalServerErrorException('Authorized but user was not found.');
        }
        req.user = { userId: user.userId, username: user.username };
      } catch (error) {
        throw new UnauthorizedException('accessToken and refreshToken are expired or not verified.');
      }
    }

    return true;
  }

  private extractAccessTokenFromHeader(req: ExtendedRequest) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
