import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AppointmentListQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const search = request.query.search || '';
    const status = request.query.status || '';
    const date = request.query.date || '';
    return { search, status, date };
  },
);
