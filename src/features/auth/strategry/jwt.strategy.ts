import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from 'generated/prisma/enums';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

export interface JWTPayload {
  sub: string;
  email: string;
  role: Role;
}

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET')!,
    });
  }
  async validate(payload: JWTPayload) {
    const isExist = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!isExist) {
      throw new UnauthorizedException('User not found');
    }

    return payload;
  }
}
