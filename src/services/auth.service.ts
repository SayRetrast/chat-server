import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { compare, hash } from 'bcrypt';
import { accessTokenConfig, refreshTokenConfig } from '../lib/jwt.config';
import { Response } from 'express';
import { RefreshTokenService } from './refreshToken.service';
import { ExtendedRequest } from 'src/interfaces/extendedRequest.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService
  ) {}

  async signIn(
    username: string,
    password: string,
    res: Response
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!username || !password) {
      throw new BadRequestException('Username and password are required.');
    }

    const user = await this.userService.findUserByUsername(username);
    if (!user) {
      throw new BadRequestException('User with such username is not found.');
    }
    const isMatchPasswords = await compare(password, user.password);
    if (!isMatchPasswords) {
      throw new BadRequestException('Wrong password.');
    }

    const { accessToken, refreshToken } = await this.tokensHandler(user, res);
    return { accessToken, refreshToken };
  }

  async signUp(
    username: string,
    password: string,
    res: Response
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!username || !password) {
      throw new BadRequestException('Username and password are required.');
    }

    const existingUser = await this.userService.findUserByUsername(username);
    if (existingUser) {
      throw new UnprocessableEntityException('User with such username already exists.');
    }

    const hashedPassword = await hash(password, 10);

    const userData = { username: username, password: hashedPassword };
    const createdUser = await this.userService.createUser(userData);

    const { accessToken, refreshToken } = await this.tokensHandler(createdUser, res);
    return { accessToken, refreshToken };
  }

  async updateTokens(req: ExtendedRequest, res: Response): Promise<{ accessToken: string; refreshToken: string }> {
    const { accessToken, refreshToken } = await this.tokensHandler(req.user, res);
    return { accessToken, refreshToken };
  }

  private async tokensHandler(
    user: { userId: string; username: string },
    res: Response
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payloadAccess = { sub: user.userId, username: user.username };
    const payloadRefresh = {};
    const accessToken = await this.jwtService.signAsync(payloadAccess, accessTokenConfig);
    const refreshToken = await this.jwtService.signAsync(payloadRefresh, refreshTokenConfig);
    await this.refreshTokenService.upsertToken(refreshToken, user.userId);
    res.cookie('refreshToken', refreshToken, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true });
    return { accessToken, refreshToken };
  }
}
