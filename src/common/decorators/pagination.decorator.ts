import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const page = Number(request.query.page) || 0;
    const pageSize = Number(request.query.pageSize) || 10;

    const skip = page * pageSize;
    return { page, pageSize, skip };
  },
);
