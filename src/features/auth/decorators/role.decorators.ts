import { SetMetadata } from '@nestjs/common';
import { Role } from 'generated/prisma/client';

export const Role_Key = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(Role_Key, roles);
