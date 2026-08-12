import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const DoctorListQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const search =
      typeof request.query.search === 'string' ? request.query.search : '';
    const typeId =
      typeof request.query.typeId === 'string' ? request.query.typeId : '';
    return { search, typeId };
  },
);
