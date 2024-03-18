import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { MessageDto } from 'src/dtos/message.dto';
import { ExtendedRequest } from 'src/interfaces/extendedRequest.interface';
import { MessageService } from 'src/services/message.service';
import { AuthAccessGuard } from '../guards/auth/auth.access.guard';
import { MessageOwnerGuard } from 'src/guards/message.owner.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthAccessGuard)
  @Post(':toUserId')
  async sendMessage(@Body() messageData: MessageDto, @Param('toUserId') toUserId: string, @Req() req: ExtendedRequest) {
    return this.messageService.createMessage({
      text: messageData.text,
      fromUserId: req.user.userId,
      toUserId: toUserId,
    });
  }

  @UseGuards(AuthAccessGuard)
  @Get(':toUserId')
  async getDialogMessages(@Param('toUserId') toUserId: string, @Req() req: ExtendedRequest) {
    return this.messageService.findDialogMessages(req.user.userId, toUserId);
  }

  @UseGuards(AuthAccessGuard, MessageOwnerGuard)
  @Put(':messageId')
  async changeMessage(@Param('messageId') messageId: number, @Body() messageData: MessageDto) {
    return this.messageService.updateMessage(messageData.text, messageId);
  }

  @UseGuards(AuthAccessGuard, MessageOwnerGuard)
  @Delete(':messageId')
  async deleteMessage(@Param('messageId') messageId: number) {
    return this.messageService.deleteMessage(messageId);
  }
}
