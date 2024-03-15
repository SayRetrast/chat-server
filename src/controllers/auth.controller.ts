import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthDto } from 'src/dtos/auth.dto';
import { AuthRefreshGuard } from 'src/guards/auth/auth.refresh.guard';
import { ExtendedRequest } from 'src/interfaces/extendedRequest.interface';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInData: AuthDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signIn(signInData.username, signInData.password, res);
  }

  @Post('registration')
  async signUp(@Body() signUpData: AuthDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signUp(signUpData.username, signUpData.password, res);
  }

  @UseGuards(AuthRefreshGuard)
  @Get()
  async authenticate(@Req() req: ExtendedRequest, @Res({ passthrough: true }) res: Response) {
    return this.authService.updateTokens(req, res);
  }
}
