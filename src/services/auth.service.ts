import { BadRequestException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { compare, hash } from 'bcrypt';
import { PrismaService } from './prisma.service';
import { accessTokenConfig, refreshTokenConfig } from '../lib/jwt.config';
import { convertDaysToMs } from 'src/lib/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService
  ) {}

  async signIn(username: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    if (!username || !password) {
      throw new BadRequestException('Username and password are required.');
    }

    const user = await this.userService.findUserByUsername(username);
    if (!user) {
      throw new BadRequestException('User with such username is not found.');
    }
    const isMatchPasswords = await compare(password, user.password);
    if (!isMatchPasswords) {
      throw new UnauthorizedException('Wrong password.');
    }

    const payloadAccess = { tokenType: 'accessToken', sub: user.userId, username: user.username };
    const payloadRefresh = { tokenType: 'refreshToken' };
    const accessToken = await this.jwtService.signAsync(payloadAccess, accessTokenConfig);
    const refreshToken = await this.jwtService.signAsync(payloadRefresh, refreshTokenConfig);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp(username: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
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

    const payloadAccess = { tokenType: 'accessToken', sub: createdUser.userId, username: createdUser.username };
    const payloadRefresh = { tokenType: 'refreshToken' };
    const accessToken = await this.jwtService.signAsync(payloadAccess, accessTokenConfig);
    const refreshToken = await this.jwtService.signAsync(payloadRefresh, refreshTokenConfig);
    await this.prisma.refreshTokens.create({
      data: {
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + convertDaysToMs(7)),
        userId: createdUser.userId,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
