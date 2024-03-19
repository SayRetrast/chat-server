import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Users } from '@prisma/client';
import { UserModel } from 'src/interfaces/userModel.interface';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UsersCreateInput): Promise<Users> {
    return this.prisma.users.create({ data });
  }

  async findUserById(userId: string): Promise<UserModel | null> {
    return this.prisma.users.findUnique({
      where: { userId: userId },
      select: {
        username: true,
        userId: true,
        avatar: true,
      },
    });
  }

  async findUserByUsername(username: string): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: { username: username },
    });
  }

  async findAllUsers(): Promise<UserModel[]> {
    return this.prisma.users.findMany({
      select: {
        username: true,
        userId: true,
        avatar: true,
      },
    });
  }

  async deleteUser(userId: string): Promise<Users> {
    return this.prisma.users.delete({ where: { userId: userId } });
  }
}
