import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Messages } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { DialogService } from './dialog.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dialogService: DialogService
  ) {}

  async createMessage(data: { text: string; dialogId: string; userId: string }): Promise<Messages> {
    if (!data.text) {
      throw new BadRequestException('Text is required');
    }

    const dialog = await this.dialogService.findDialogById(data.dialogId);
    if (!dialog) {
      throw new NotFoundException('Dialog not found.');
    }
    if (dialog.userOneId !== data.userId && dialog.userTwoId !== data.userId) {
      throw new BadRequestException("Can't send a message from user outside of the dialog");
    }

    return this.prisma.messages.create({ data: data });
  }

  async findMessageById(messageId: number): Promise<Messages | null> {
    return this.prisma.messages.findUnique({ where: { messageId: messageId } });
  }

  async findDialogMessages(dialogId: string): Promise<Messages[]> {
    return this.prisma.messages.findMany({ where: { dialogId: dialogId } });
  }

  async deleteMessage(messageId: number): Promise<Messages> {
    return this.prisma.messages.delete({ where: { messageId: messageId } });
  }

  async updateMessage(text: string, messageId: number): Promise<Messages> {
    return this.prisma.messages.update({
      where: { messageId: messageId },
      data: { text: text },
    });
  }
}
