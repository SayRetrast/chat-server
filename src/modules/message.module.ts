import { Module } from '@nestjs/common';
import { MessageController } from 'src/controllers/message.controller';
import { MessageService } from 'src/services/message.service';
import { DialogModule } from './dialog.module';
import { MessageGateway } from 'src/gateways/message.gateway';

@Module({
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
  imports: [DialogModule],
})
export class MessageModule {}
