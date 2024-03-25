import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ExtendedRequest } from 'src/interfaces/extendedRequest.interface';
import { MessageService } from 'src/services/message.service';

@Injectable()
export class MessageOwnerGuard implements CanActivate {
  constructor(private readonly messageService: MessageService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: ExtendedRequest = context.switchToHttp().getRequest();

    const messageId = req.params['messageId'];
    const message = await this.messageService.findMessageById(+messageId);
    if (!message) {
      throw new BadRequestException('Message is not found.');
    }

    if (message.userId !== req.user.userId) {
      throw new ForbiddenException("Can't change not owned message.");
    }

    return true;
  }
}
