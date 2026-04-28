import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MedicineListQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const search = request.query.search || '';
    return { search };
  },
);
