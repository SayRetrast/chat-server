import { Module } from '@nestjs/common';
import { MessageController } from 'src/controllers/message.controller';
import { MessageService } from 'src/services/message.service';
import { DialogModule } from './dialog.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [DialogModule],
})
export class MessageModule {}
