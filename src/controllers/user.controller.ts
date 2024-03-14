import { UserDto } from 'src/dtos/user.dto';
import { UserService } from 'src/services/user.service';
import { Users as UserModel } from '@prisma/client';
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ExtendedRequest } from 'src/interfaces/extendedRequest.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signUpUser(@Body() userData: UserDto): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @UseGuards(AuthGuard)
  @Get('users')
  async getAllUsers(@Req() req: ExtendedRequest): Promise<UserModel[]> {
    console.log(req.user, 'called in user controller');
    return this.userService.findAllUsers();
  }

  @Get(':username')
  async getUser(@Param('username') username: string): Promise<UserModel | null> {
    return this.userService.findUserByUsername(username);
  }
}
