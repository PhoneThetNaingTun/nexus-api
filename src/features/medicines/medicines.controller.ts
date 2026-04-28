import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto';
import { isPublicRole } from '../auth/decorators/is-public-role.decorators';
import { Roles } from '../auth/decorators/role.decorators';
import { RoleGuard } from '../auth/guards/role.guard';
import { MedicineListQuery } from './decorators/medicine-list.decoratior';
import {
  CreateMedicineDto,
  MedicineListQueryDto,
  UpdateMedicineDto,
} from './dto';
import { MedicinesService } from './medicines.service';

@UseGuards(RoleGuard)
@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Get('list')
  @isPublicRole()
  async findAll(
    @Pagination() pagination: PaginationDto,
    @MedicineListQuery() query: MedicineListQueryDto,
  ) {
    return await this.medicinesService.findAll(pagination, query);
  }

  @Get(':id')
  @isPublicRole()
  async findOne(@Param('id') id: string) {
    return await this.medicinesService.findOne(id);
  }

  @Post('create')
  @Roles('ADMIN')
  async create(@Body() dto: CreateMedicineDto) {
    return await this.medicinesService.createOne(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(@Body() dto: UpdateMedicineDto, @Param('id') id: string) {
    return await this.medicinesService.updateOne(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return await this.medicinesService.softDeleteOne(id);
  }
}
