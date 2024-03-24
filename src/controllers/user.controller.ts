import { BadRequestException, Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthAccessGuard } from 'src/guards/auth/auth.access.guard';
import { UserService } from 'src/services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthAccessGuard)
  @Get('all')
  async getAllUsers() {
    return this.userService.findAllUsers();
  }

  @UseGuards(AuthAccessGuard)
  @Get('search/:username')
  async searchUsers(@Param('username') username: string) {
    return this.userService.findUsersByUsername(username);
  }

  @UseGuards(AuthAccessGuard)
  @Get('user/:userId')
  async getUserById(@Param('userId') userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('User is not found.');
    }

    return user;
  }

  @UseGuards(AuthAccessGuard)
  @Delete('user/:userId')
  async deleteUser(@Param('userId') userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('User is not found.');
    }

    return this.userService.deleteUser(userId);
  }
}
