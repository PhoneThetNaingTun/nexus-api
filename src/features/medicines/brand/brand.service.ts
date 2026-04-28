import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { BrandListQueryDto, CreateBrandDto } from './dto';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return { data: brand };
  }

  async createOne(dto: CreateBrandDto) {
    const brand = await this.prisma.brand.create({
      data: dto,
    });
    return { data: brand };
  }
  async updateOne(id: string, dto: CreateBrandDto) {
    const { data } = await this.findOne(id);

    const updatedBrand = await this.prisma.brand.update({
      where: { id: data.id },
      data: dto,
    });
    return { data: updatedBrand };
  }

  async softDeleteOne(id: string) {
    const { data } = await this.findOne(id);
    const deletedBrand = await this.prisma.brand.update({
      where: { id: data.id },
      data: { deletedAt: new Date() },
    });
    return { data: deletedBrand };
  }

  async findAll(pagination: PaginationDto, query: BrandListQueryDto) {
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

    const where: Prisma.BrandWhereInput = {
      ...searchFilter,
      deletedAt: null,
    };

    const brands = await this.prisma.brand.findMany({
      where: where,
      skip,
      take: pageSize,
    });
    const totalCount = await this.prisma.brand.count({
      where: where,
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    return { data: brands, totalCount, totalPages };
  }
}
