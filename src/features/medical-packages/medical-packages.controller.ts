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
import { isPublicRole } from '../auth/decorators/is-public-role.decorators';
import { Roles } from '../auth/decorators/role.decorators';
import { MedicalPackageListQuery } from './decorators/medical-package-list.decorator';
import {
  CreateMedicalPackageDto,
  MedicalPackageListQueryDto,
  UpdateMedicalPackageDto,
} from './dto';
import { MedicalPackagesService } from './medical-packages.service';

@Controller('medical-packages')
export class MedicalPackagesController {
  constructor(
    private readonly medicalPackagesService: MedicalPackagesService,
  ) {}

  @Get('list')
  @isPublicRole()
  async findAll(
    @Pagination() pagination: PaginationDto,
    @MedicalPackageListQuery() query: MedicalPackageListQueryDto,
  ) {
    return await this.medicalPackagesService.findAll(pagination, query);
  }

  @Get(':id')
  @isPublicRole()
  async findOne(@Param('id') id: string) {
    return await this.medicalPackagesService.findOne(id);
  }

  @Post('create')
  @Roles('ADMIN')
  async create(@Body() dto: CreateMedicalPackageDto) {
    return await this.medicalPackagesService.createOne(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(@Body() dto: UpdateMedicalPackageDto, @Param('id') id: string) {
    return await this.medicalPackagesService.updateOne(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return await this.medicalPackagesService.softDeleteOne(id);
  }
}
