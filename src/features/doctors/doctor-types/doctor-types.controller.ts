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
import { DoctorTypeListQuery } from './decorators/doctor-type-list.decorator';
import { DoctorTypesService } from './doctor-types.service';
import {
  CreateDoctorTypeDto,
  ListDoctorTypeQueryDto,
  UpdateDoctorTypeDto,
} from './dto';

@Controller('doctor-types')
export class DoctorTypesController {
  constructor(private readonly doctorTypesService: DoctorTypesService) {}

  @Get('list')
  async getAll(
    @Pagination() pagination: PaginationDto,
    @DoctorTypeListQuery() query: ListDoctorTypeQueryDto,
  ) {
    return this.doctorTypesService.findAll(pagination, query);
  }

  @Post('create')
  async createOne(@Body() dto: CreateDoctorTypeDto) {
    return this.doctorTypesService.crateOne(dto);
  }

  @Patch('/:id')
  async updateOne(@Body() dto: UpdateDoctorTypeDto, @Param('id') id: string) {
    return this.doctorTypesService.updateOne(id, dto);
  }

  @Delete('/:id')
  async softDeleteOne(@Param('id') id: string) {
    return this.doctorTypesService.softDeleteOne(id);
  }
}
