import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto';
import { DoctorListQuery } from '../decorators/doctor-list.decorator';
import {
  CreateScheduleDto,
  GetAvaliableDoctorScheduleQueryDto,
  UpdateScheduleDto,
} from './dto';
import { ScheduleListQueryDto } from './dto/list-schedule-query.dto';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get('list/:id')
  async findAll(
    @Param('id') doctorId: string,
    @Pagination() pagination: PaginationDto,
    @DoctorListQuery() query: ScheduleListQueryDto,
  ) {
    return await this.schedulesService.findListByDoctorId(
      doctorId,
      pagination,
      query,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.schedulesService.findOne(id);
  }

  @Post('create/:id')
  async create(@Param('id') id: string, @Body() dto: CreateScheduleDto) {
    return await this.schedulesService.createOne(id, dto);
  }

  @Patch(':id')
  async update(@Body() dto: UpdateScheduleDto, @Param('id') id: string) {
    return await this.schedulesService.updateOne(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.schedulesService.deleteOne(id);
  }

  @Get('available/:doctorId')
  async getAvailableSchedule(
    @Param('doctorId') doctorId: string,
    @Query() query: GetAvaliableDoctorScheduleQueryDto,
  ) {
    return await this.schedulesService.getAvailableSchedule(doctorId, query);
  }
}
