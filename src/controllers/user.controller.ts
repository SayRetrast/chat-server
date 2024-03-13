import { UserDto } from 'src/dtos/user.dto';
import { UserService } from 'src/services/user.service';
import { Users as UserModel } from '@prisma/client';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signUpUser(@Body() userData: UserDto): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Get(':username')
  async getUser(@Param('username') username: string): Promise<UserModel | null> {
    return this.userService.findUserByUsername(username);
  }
}
