import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import argon from 'argon2';
import { addDays } from 'date-fns';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto, RegisterDto } from './dto';
import { JWTRefreshPayload } from './strategry/jwt-refresh.strategy';
import { JWTPayload } from './strategry/jwt.strategy';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto, isUser?: boolean) {
    const isExist = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!isExist) {
      throw new NotFoundException('Email not fond');
    }

    if (isUser && isExist.role !== 'USER') {
      throw new NotFoundException('User not found');
    }
    const isMatch = await argon.verify(isExist.password, dto.password);
    if (!isMatch) {
      throw new NotFoundException('Password not match');
    }

    const tokens = await this.generateTokens({
      email: isExist.email,
      sub: isExist.id,
      role: isExist.role,
    });
    return {
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    };
  }
  async register(dto: RegisterDto) {
    const isExist = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (isExist) {
      throw new NotFoundException('Email already exists');
    }
    const hashedPassword = await argon.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: 'USER',
      },
    });
    const tokens = await this.generateTokens({
      email: user.email,
      sub: user.id,
      role: user.role,
    });
    return {
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    };
  }

  async refresh(dto: JWTRefreshPayload) {
    const isExist = await this.prisma.token.findUnique({
      where: { jti: dto.jti },
      include: { user: true },
    });
    if (!isExist) {
      throw new NotFoundException('Token not Found');
    }
    const tokens = await this.generateTokens({
      email: isExist.user.email,
      sub: isExist.user.id,
      role: isExist.user.role,
    });
    return {
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    };
  }

  async me(dto: JWTPayload) {
    const isExist = await this.prisma.user.findUnique({
      where: { id: dto.sub },
      select: {
        id: true,
        email: true,
        role: true,
        image: true,
        name: true,
      },
    });

    if (!isExist) {
      throw new NotFoundException('User not found');
    }
    return { data: isExist };
  }

  async generateTokens(payload: JWTPayload) {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: 15 * 60 * 1000, // 15 min
    });

    const jti = uuidv4();
    const refresh_token = await this.jwtService.signAsync(
      { jti },
      {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d', // Use string format for clarity
      },
    );

    const expiredAt = addDays(new Date(), 7);

    // Now simply create the new session record
    await this.prisma.token.create({
      data: {
        user_id: payload.sub,
        token: refresh_token,
        jti: jti,
        expiredAt,
      },
    });

    // Optional: Trigger cleanup here or via a Cron job
    await this.cleanupExpiredTokens();

    return { access_token, refresh_token };
  }

  /**
   * Removes all tokens that have passed their expiration date
   */
  async cleanupExpiredTokens() {
    try {
      const result = await this.prisma.token.deleteMany({
        where: {
          expiredAt: {
            lt: new Date(), // 'lt' stands for 'less than' (before now)
          },
        },
      });
      // result.count tells you how many rows were cleaned up
    } catch (error) {
      console.error('Failed to cleanup expired tokens:', error);
    }
  }
}
