import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ROLE_KEY = 'isPublicRole';

export const isPublicRole = () => SetMetadata(IS_PUBLIC_ROLE_KEY, true);
