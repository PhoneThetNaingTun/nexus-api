import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './decorators/get-user.decorators';
import { isPublic } from './decorators/is-public.decorators';
import { LoginDto, RegisterDto } from './dto';
import { JWTRefreshGuard } from './guards/jwt-refresh.guard';
import { type JWTRefreshPayload } from './strategry/jwt-refresh.strategy';
import { type JWTPayload } from './strategry/jwt.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @isPublic()
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  @Post('user/login')
  @isPublic()
  async userLogin(@Body() dto: LoginDto) {
    return this.authService.login(dto, true);
  }
  @Post('register')
  @isPublic()
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('me')
  async me(@User() dto: JWTPayload) {
    return this.authService.me(dto);
  }

  @Post('refresh')
  @isPublic()
  @UseGuards(JWTRefreshGuard)
  async refresh(@User() dto: JWTRefreshPayload) {
    return this.authService.refresh(dto);
  }
}
