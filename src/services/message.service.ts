import { Injectable } from '@nestjs/common';
import { Messages as MessageModel } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(data: { text: string; fromUserId: string; toUserId: string }): Promise<MessageModel> {
    return this.prisma.messages.create({ data: data });
  }

  async findMessageById(messageId: number): Promise<MessageModel | null> {
    return this.prisma.messages.findUnique({ where: { messageId: messageId } });
  }

  async findDialogMessages(fromUserId: string, toUserId: string): Promise<MessageModel[]> {
    return this.prisma.messages.findMany({ where: { AND: [{ fromUserId: fromUserId }, { toUserId: toUserId }] } });
  }

  async deleteMessage(messageId: number): Promise<MessageModel> {
    return this.prisma.messages.delete({ where: { messageId: messageId } });
  }

  async updateMessage(text: string, messageId: number): Promise<MessageModel> {
    return this.prisma.messages.update({
      where: { messageId: messageId },
      data: { text: text },
    });
  }
}
