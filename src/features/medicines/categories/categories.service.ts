import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CategoryListQueryDto } from './dto/category-list-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category Not Found1');

    return { data: category };
  }

  async createOne(dto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: dto,
    });
    return { data: category };
  }

  async updateOne(id: string, dto: UpdateCategoryDto) {
    const { data } = await this.findOne(id);
    const category = await this.prisma.category.update({
      where: { id: data.id },
      data: dto,
    });
    return { data: category };
  }

  async softDeleteOne(id: string) {
    const { data } = await this.findOne(id);
    const category = await this.prisma.category.update({
      where: { id: data.id },
      data: { deletedAt: new Date() },
    });
    return { data: category };
  }

  async findAll(pagination: PaginationDto, query: CategoryListQueryDto) {
    const { search } = query;
    const { pageSize, skip } = pagination;

    const searchFilter = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const where: Prisma.CategoryWhereInput = {
      ...searchFilter,
      deletedAt: null,
    };

    const categories = await this.prisma.category.findMany({
      where: where,
      skip,
      take: pageSize,
    });
    const totalCount = await this.prisma.category.count({
      where: where,
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    return { data: categories, totalCount, totalPages };
  }
}
