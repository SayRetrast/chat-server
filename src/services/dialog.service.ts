import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Dialogs } from '@prisma/client';

@Injectable()
export class DialogService {
  constructor(private readonly prisma: PrismaService) {}

  async findDialogById(dialogId: string): Promise<Dialogs | null> {
    return this.prisma.dialogs.findUnique({ where: { dialogId: dialogId } });
  }

  async findDialogByUsers(userOneId: string, userTwoId: string): Promise<Dialogs | null> {
    const dialogOne = await this.prisma.dialogs.findUnique({
      where: {
        userOneId_userTwoId: {
          userOneId: userOneId,
          userTwoId: userTwoId,
        },
      },
    });
    const dialogTwo = await this.prisma.dialogs.findUnique({
      where: {
        userOneId_userTwoId: {
          userOneId: userTwoId,
          userTwoId: userOneId,
        },
      },
    });

    if (dialogOne) return dialogOne;
    if (dialogTwo) return dialogTwo;
    return null;
  }

  async createDialog(userOneId: string, userTwoId: string): Promise<Dialogs> {
    const dialog = await this.findDialogByUsers(userOneId, userTwoId);
    if (dialog) {
      throw new ConflictException('Dialog between these users already exists.');
    }

    return this.prisma.dialogs.create({ data: { userOneId: userOneId, userTwoId: userTwoId } });
  }
}
