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
import { isPublicRole } from 'src/features/auth/decorators/is-public-role.decorators';
import { Roles } from 'src/features/auth/decorators/role.decorators';
import { RoleGuard } from 'src/features/auth/guards/role.guard';
import { MedicalPackageItemListQuery } from './decorators/medical-package-item-list.decorator';
import {
  CreateMedicalPackageItemDto,
  MedicalPackageItemListQueryDto,
  UpdateMedicalPackageItemDto,
} from './dto';
import { MedicalPackageItemsService } from './medical-package-items.service';

@UseGuards(RoleGuard)
@Controller('medical-package-items')
export class MedicalPackageItemsController {
  constructor(
    private readonly medicalPackageItemsService: MedicalPackageItemsService,
  ) {}

  @Get('list')
  @isPublicRole()
  async findAll(
    @Pagination() pagination: PaginationDto,
    @MedicalPackageItemListQuery() query: MedicalPackageItemListQueryDto,
  ) {
    return await this.medicalPackageItemsService.findAll(pagination, query);
  }

  @Get(':id')
  @isPublicRole()
  async findOne(@Param('id') id: string) {
    return await this.medicalPackageItemsService.findOne(id);
  }

  @Post('create')
  @Roles('ADMIN')
  async create(@Body() dto: CreateMedicalPackageItemDto) {
    return await this.medicalPackageItemsService.createOne(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(
    @Body() dto: UpdateMedicalPackageItemDto,
    @Param('id') id: string,
  ) {
    return await this.medicalPackageItemsService.updateOne(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return await this.medicalPackageItemsService.softDeleteOne(id);
  }
}
