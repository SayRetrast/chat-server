import { Module } from '@nestjs/common';
import { MessageController } from 'src/controllers/message.controller';
import { MessageService } from 'src/services/message.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
