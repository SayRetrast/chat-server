import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from 'src/dtos/auth.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInData: AuthDto) {
    return this.authService.signIn(signInData.username, signInData.password);
  }

  @Post('registration')
  async signUp(@Body() signUpData: AuthDto) {
    return this.authService.signUp(signUpData.username, signUpData.password);
  }
}
