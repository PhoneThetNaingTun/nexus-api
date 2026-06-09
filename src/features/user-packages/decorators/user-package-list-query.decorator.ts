import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserPackageListQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const search = request.query.search || '';
    const status = request.query.status || '';
    const purchaseDate = request.query.purchaseDate || '';
    return { search, status, purchaseDate };
  },
);
