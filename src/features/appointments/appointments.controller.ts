import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto';
import { User } from '../auth/decorators/get-user.decorators';
import { type JWTPayload } from '../auth/strategry/jwt.strategy';
import { AppointmentsService } from './appointments.service';
import { AppointmentListQuery } from './decorators/appointment-list.decorator';
import { AppointmentApproveDto, AppointmentRejectDto } from './dto';
import { AppointmentListQueryDto } from './dto/appointmnt-list-query.dto';

@Controller('admin/appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('list')
  async findAll(
    @Pagination() pagination: PaginationDto,
    @AppointmentListQuery() query: AppointmentListQueryDto,
    @User() user: JWTPayload,
  ) {
    return await this.appointmentsService.findAll(pagination, query, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.appointmentsService.findOne(id);
  }

  @Post('approve')
  async approve(@Body() dto: AppointmentApproveDto) {
    return await this.appointmentsService.approve(dto);
  }
  @Post('reject')
  async reject(@Body() dto: AppointmentRejectDto) {
    return await this.appointmentsService.reject(dto);
  }
}
