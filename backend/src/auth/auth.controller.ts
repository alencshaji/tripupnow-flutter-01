import { Controller, Query, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';
import { SignupDto, LoginDto, Roles, OTPVerifyDto, ForgotPasswordDto, EmailDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WithRoles } from './decorator/role.decorator';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RolesGuard } from './guards/roles.guards';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { JwtService } from '@nestjs/jwt';

@ApiTags('auth')
@ApiBearerAuth('defaultBearerAuth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) { }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Req() req: any) {
    return this.authService.signup(signupDto, req);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: any) {
    return await this.authService.login(loginDto, req);
  }


  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    return await this.authService.init(req?.user['sub'])
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = this.jwtService.decode(token);
    const userId = decodedToken.sub;
    const refreshToken = req.user['refreshToken'];

    return await this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: OTPVerifyDto) {
    return this.authService.verifyOtp(body.email, body.otp)
  }

  
  @Post('send-otp')
  async requestPasswordReset(@Body() body:EmailDto) {
    return this.authService.sendOtp(body.email)
  }

  @Post('reset-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    const { otp, password, email } = forgotPasswordDto;
    // const userId = req.user['sub']; 

    return this.authService.resetPassword(otp, password, email);
  }


  @Get('logout')
  @UseGuards(AccessTokenGuard)
  logout(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = this.jwtService.decode(token);

    return this.authService.logout(decodedToken.sub);
  }

}
