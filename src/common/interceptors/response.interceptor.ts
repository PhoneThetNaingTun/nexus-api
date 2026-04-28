import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Define a structured response interface
export interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  status: number;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const { page, pageSize } = request.query;

    return next.handle().pipe(
      map((data) => {
        const status = response.statusCode;

        if (page && pageSize) {
          return {
            data: data?.list ?? data,
            pagination: {
              page: Number(page),
              pageSize: Number(pageSize),
              totalCount: data?.totalCount ?? 0,
              totalPages: data?.totalPages ?? 0,
            },
            status,
          };
        }

        return {
          data,
          status,
        };
      }),
    );
  }
}
