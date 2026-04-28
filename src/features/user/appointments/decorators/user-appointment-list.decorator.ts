import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserAppointmentListQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const search = request.query.search || '';
    const date = request.query.date || '';
    return { search, date };
  },
);
