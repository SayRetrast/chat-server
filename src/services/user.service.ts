import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Users as UserModel } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UsersCreateInput): Promise<UserModel> {
    return this.prisma.users.create({ data });
  }

  async findUserById(userId: string): Promise<UserModel | null> {
    return this.prisma.users.findUnique({
      where: { userId: userId },
    });
  }

  async findUserByUsername(username: string): Promise<UserModel | null> {
    return this.prisma.users.findUnique({
      where: { username: username },
    });
  }

  async findAllUsers(): Promise<UserModel[]> {
    return this.prisma.users.findMany();
  }

  async deleteUser(userId: string): Promise<UserModel> {
    return this.prisma.users.delete({ where: { userId: userId } });
  }
}
