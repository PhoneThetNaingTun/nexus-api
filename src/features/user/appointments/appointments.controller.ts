import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto';
import { User } from 'src/features/auth/decorators/get-user.decorators';
import { type JWTPayload } from 'src/features/auth/strategry/jwt.strategy';
import { AppointmentsService } from './appointments.service';
import { UserAppointmentListQuery } from './decorators/user-appointment-list.decorator';
import { CreateAppointmentDto, UserAppointmentListQueryDto } from './dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('list')
  async findAllByUser(
    @User() user: JWTPayload,
    @Pagination() pagination: PaginationDto,
    @UserAppointmentListQuery() query: UserAppointmentListQueryDto,
  ) {
    return await this.appointmentsService.findAllByUser(
      user,
      pagination,
      query,
    );
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.appointmentsService.findOne(id);
  }

  @Post('create')
  async createAppointment(
    @User() user: JWTPayload,
    @Body() dto: CreateAppointmentDto,
  ) {
    return await this.appointmentsService.create(user, dto);
  }
}
