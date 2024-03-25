import { Module } from '@nestjs/common';
import { DialogController } from 'src/controllers/dialog.controller';
import { DialogService } from 'src/services/dialog.service';

@Module({
  controllers: [DialogController],
  providers: [DialogService],
  exports: [DialogService],
})
export class DialogModule {}
