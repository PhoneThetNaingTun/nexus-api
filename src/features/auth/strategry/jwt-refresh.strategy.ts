import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

export interface JWTRefreshPayload {
  jti: string;
}

@Injectable()
export class JWTRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      secretOrKey: config.get('JWT_REFRESH_SECRET')!,
    });
  }
  async validate(payload: JWTRefreshPayload) {
    const isExist = await this.prisma.token.findUnique({
      where: { jti: payload.jti },
    });

    if (!isExist) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (isExist.expiredAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    return payload;
  }
}
