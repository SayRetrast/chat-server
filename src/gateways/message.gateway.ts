import { JwtService } from '@nestjs/jwt';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from 'src/services/message.service';

@WebSocketGateway({ cors: { origin: true } })
export class MessageGateway {
  constructor(
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message_send')
  async sendMessage(
    @MessageBody() data: { accessToken: string; text: string; dialogId: string; userId: string }
  ): Promise<void> {
    try {
      await this.jwtService.verifyAsync(data.accessToken, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      });
    } catch (error) {
      throw new WsException('Unauthorized');
    }

    this.messageService.createMessage({ text: data.text, dialogId: data.dialogId, userId: data.userId });
    this.server.emit('message_send');
  }

  @SubscribeMessage('message_delete')
  async deleteMessage(@MessageBody() data: { accessToken: string; messageId: number }): Promise<void> {
    try {
      await this.jwtService.verifyAsync(data.accessToken, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      });
    } catch (error) {
      throw new WsException('Unauthorized');
    }

    this.messageService.deleteMessage(data.messageId);
    this.server.emit('message_delete');
  }
}
