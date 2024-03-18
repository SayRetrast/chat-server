import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthAccessGuard } from 'src/guards/auth/auth.access.guard';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthAccessGuard)
  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    return this.userService.findUserById(userId);
  }

  @UseGuards(AuthAccessGuard)
  @Get('all')
  async getAllUsers() {
    return this.userService.findAllUsers();
  }

  @UseGuards(AuthAccessGuard)
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
