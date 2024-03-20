import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExtendedRequest } from 'src/interfaces/extendedRequest.interface';
import { PayloadAccess } from 'src/interfaces/payloadAccess.interface';

@Injectable()
export class AuthAccessGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

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
      throw new UnauthorizedException('AccessToken is invalid.');
    }

    return true;
  }

  private extractAccessTokenFromHeader(req: ExtendedRequest) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
