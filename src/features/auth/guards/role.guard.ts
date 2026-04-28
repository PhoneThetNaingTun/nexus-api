import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'generated/prisma/client';
import { IS_PUBLIC_ROLE_KEY } from '../decorators/is-public-role.decorators';
import { Role_Key } from '../decorators/role.decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) return true;

    const roles = this.reflector.getAllAndOverride<Role[]>(Role_Key, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!roles.includes(user.role)) {
      throw new ForbiddenException([
        'You are not authorized to access this resource',
      ]);
    }

    return true;
  }
}
