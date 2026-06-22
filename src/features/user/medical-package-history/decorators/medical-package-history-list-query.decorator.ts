import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MedicalPackageHistoryListQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const search = request.query.search || '';
    return { search };
  },
);
