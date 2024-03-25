import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthAccessGuard } from 'src/guards/auth/auth.access.guard';
import { ExtendedRequest } from 'src/interfaces/extendedRequest.interface';
import { DialogService } from 'src/services/dialog.service';

@Controller('dialogs')
export class DialogController {
  constructor(private readonly dialogService: DialogService) {}

  @UseGuards(AuthAccessGuard)
  @Get('user')
  async getUserDialogs(@Req() req: ExtendedRequest) {
    return this.dialogService.findUserDialogs(req.user.userId);
  }

  @UseGuards(AuthAccessGuard)
  @Get('dialog/:dialogId')
  async getDialogById(@Param('dialogId') dialogId: string) {
    return this.dialogService.findDialogById(dialogId);
  }

  @UseGuards(AuthAccessGuard)
  @Post('dialog/:userId')
  async createDialog(@Param('userId') userId: string, @Req() req: ExtendedRequest) {
    return this.dialogService.createDialog(req.user.userId, userId);
  }
}
