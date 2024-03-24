import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthAccessGuard } from 'src/guards/auth/auth.access.guard';
import { ExtendedRequest } from 'src/interfaces/extendedRequest.interface';
import { DialogService } from 'src/services/dialog.service';

@Controller('dialogs')
export class DialogController {
  constructor(private readonly dialogService: DialogService) {}

  @UseGuards(AuthAccessGuard)
  @Post('dialog/:userId')
  async startDialog(@Param('userId') userId: string, @Req() req: ExtendedRequest) {
    return this.dialogService.createDialog(req.user.userId, userId);
  }
}
