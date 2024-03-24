import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RefreshTokens } from '@prisma/client';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async findToken(refreshToken: string): Promise<RefreshTokens | null> {
    return this.prisma.refreshTokens.findUnique({
      where: { refreshToken: refreshToken },
    });
  }

  async findTokenByUserId(userId: string): Promise<RefreshTokens | null> {
    return this.prisma.refreshTokens.findUnique({ where: { userId: userId } });
  }

  async createToken(refreshToken: string, userId: string): Promise<RefreshTokens> {
    return this.prisma.refreshTokens.create({
      data: { refreshToken: refreshToken, userId: userId },
    });
  }

  async upsertToken(refreshToken: string, userId: string): Promise<RefreshTokens> {
    return this.prisma.refreshTokens.upsert({
      where: { userId: userId },
      update: { refreshToken: refreshToken },
      create: { refreshToken: refreshToken, userId: userId },
    });
  }

  async deleteToken(userId: string): Promise<RefreshTokens> {
    return this.prisma.refreshTokens.delete({ where: { userId: userId } });
  }
}
