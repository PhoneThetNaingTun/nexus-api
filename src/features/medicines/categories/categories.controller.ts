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
import { CategoriesService } from './categories.service';
import { CategoryListQuery } from './decorators/category-list.decorator';
import { CategoryListQueryDto } from './dto/category-list-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(RoleGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('list')
  @isPublicRole()
  async findAll(
    @Pagination() pagination: PaginationDto,
    @CategoryListQuery() query: CategoryListQueryDto,
  ) {
    return await this.categoriesService.findAll(pagination, query);
  }

  @Get(':id')
  @isPublicRole()
  async findOne(@Param('id') id: string) {
    return await this.categoriesService.findOne(id);
  }

  @Post('create')
  @Roles('ADMIN')
  async create(@Body() dto: CreateCategoryDto) {
    return await this.categoriesService.createOne(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  async update(@Body() dto: UpdateCategoryDto, @Param('id') id: string) {
    return await this.categoriesService.updateOne(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return await this.categoriesService.softDeleteOne(id);
  }
}
