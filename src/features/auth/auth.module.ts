import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTRefreshStrategy } from './strategry/jwt-refresh.strategy';
import { JWTStrategy } from './strategry/jwt.strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, JWTRefreshStrategy],
})
export class AuthModule {}
