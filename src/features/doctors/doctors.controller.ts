import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto';
import { DoctorListQuery } from './decorators/doctor-list.decorator';

import { DoctorsService } from './doctors.service';
import { CreateDoctorDto, DoctorListQueryDto, UpdateDoctorDto } from './dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get('list')
  async findAll(
    @Pagination() pagination: PaginationDto,
    @DoctorListQuery() query: DoctorListQueryDto,
  ) {
    return await this.doctorsService.findAll(pagination, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.doctorsService.findOne(id);
  }

  @Post('create')
  async create(@Body() dto: CreateDoctorDto) {
    return await this.doctorsService.createOne(dto);
  }

  @Patch(':id')
  async update(@Body() dto: UpdateDoctorDto, @Param('id') id: string) {
    return await this.doctorsService.updateOne(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.doctorsService.softDeleteOne(id);
  }
}
