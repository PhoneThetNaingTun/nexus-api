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
import { BrandService } from './brand.service';
import { BrandListQuery } from './decorators/brand-list.decorator';
import { BrandListQueryDto, CreateBrandDto } from './dto';

@UseGuards(RoleGuard)
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get('list')
  @isPublicRole()
  async findAll(
    @Pagination() pagination: PaginationDto,
    @BrandListQuery() query: BrandListQueryDto,
  ) {
    return await this.brandService.findAll(pagination, query);
  }

  @Get(':id')
  @isPublicRole()
  async findOne(@Param('id') id: string) {
    return await this.brandService.findOne(id);
  }

  @Post('create')
  @Roles('ADMIN')
  async create(@Body() dto: CreateBrandDto) {
    return await this.brandService.createOne(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(@Body() dto: CreateBrandDto, @Param('id') id: string) {
    return await this.brandService.updateOne(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return await this.brandService.softDeleteOne(id);
  }
}
