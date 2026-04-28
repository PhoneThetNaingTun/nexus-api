import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    switch (exception.code) {
      case 'P2002':
        throw new BadRequestException('Duplicate field value');

      case 'P2025':
        throw new NotFoundException('Record not found');

      case 'P2003':
        throw new BadRequestException('Foreign key constraint failed');

      case 'P2000':
        throw new BadRequestException('Value too long for field');

      case 'P2011':
        throw new BadRequestException('Null constraint violation');

      default:
        throw new BadRequestException('Internal Server Errors');
    }
  }
}
