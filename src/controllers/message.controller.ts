import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { MessageDto } from 'src/dtos/message.dto';
import { ExtendedRequest } from 'src/interfaces/extendedRequest.interface';
import { MessageService } from 'src/services/message.service';
import { AuthAccessGuard } from '../guards/auth/auth.access.guard';
import { MessageOwnerGuard } from 'src/guards/message.owner.guard';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthAccessGuard)
  @Post('message/:dialogId')
  async sendMessage(@Body() messageData: MessageDto, @Param('dialogId') dialogId: string, @Req() req: ExtendedRequest) {
    return this.messageService.createMessage({
      text: messageData.text,
      userId: req.user.userId,
      dialogId: dialogId,
    });
  }

  @UseGuards(AuthAccessGuard)
  @Get('dialog/:dialogId')
  async getDialogMessages(@Param('dialogId') dialogId: string) {
    return this.messageService.findDialogMessages(dialogId);
  }

  @UseGuards(AuthAccessGuard, MessageOwnerGuard)
  @Put('message/:messageId')
  async changeMessage(@Param('messageId') messageId: number, @Body() messageData: MessageDto) {
    return this.messageService.updateMessage(messageData.text, +messageId);
  }

  @UseGuards(AuthAccessGuard, MessageOwnerGuard)
  @Delete('message:messageId')
  async deleteMessage(@Param('messageId') messageId: number) {
    return this.messageService.deleteMessage(+messageId);
  }
}
