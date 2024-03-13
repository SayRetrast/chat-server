import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, User as UserModel } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<UserModel> {
    return this.prisma.user.create({ data });
  }

  async findUserByUsername(username: string): Promise<UserModel | null> {
    return this.prisma.user.findUnique({
      where: { username: username },
    });
  }
}
