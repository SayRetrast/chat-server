import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Users as UserModel } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UsersCreateInput): Promise<UserModel> {
    return this.prisma.users.create({ data });
  }

  async findUserByUsername(username: string): Promise<UserModel | null> {
    return this.prisma.users.findUnique({
      where: { username: username },
    });
  }
}
