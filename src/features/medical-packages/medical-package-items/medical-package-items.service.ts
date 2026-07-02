import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import {
  CreateMedicalPackageItemDto,
  MedicalPackageItemListQueryDto,
  UpdateMedicalPackageItemDto,
} from './dto';

@Injectable()
export class MedicalPackageItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const medicalPackageItem = await this.prisma.medicalPackageItem.findUnique({
      where: { id },
    });
    if (!medicalPackageItem) {
      throw new NotFoundException('Medical package item not found');
    }
    return { data: medicalPackageItem };
  }

  async createOne(dto: CreateMedicalPackageItemDto) {
    const medicalPackageItem = await this.prisma.medicalPackageItem.create({
      data: dto,
    });
    return { data: medicalPackageItem };
  }
  async updateOne(id: string, dto: UpdateMedicalPackageItemDto) {
    const { data } = await this.findOne(id);

    const updatedMedicalPackage = await this.prisma.medicalPackageItem.update({
      where: { id: data.id },
      data: dto,
    });
    return { data: updatedMedicalPackage };
  }

  async softDeleteOne(id: string) {
    const { data } = await this.findOne(id);
    const deleteMedicalPackageItem =
      await this.prisma.medicalPackageItem.update({
        where: { id: data.id },
        data: { deletedAt: new Date() },
      });
    return { data: deleteMedicalPackageItem };
  }

  async findAll(
    pagination: PaginationDto,
    query: MedicalPackageItemListQueryDto,
  ) {
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

    const where: Prisma.MedicalPackageItemWhereInput = {
      ...searchFilter,
      deletedAt: null,
    };

    const medicalPackageItems = await this.prisma.medicalPackageItem.findMany({
      where: where,
      skip,
      take: pageSize,
    });
    const totalCount = await this.prisma.medicalPackageItem.count({
      where: where,
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    return { data: medicalPackageItems, totalCount, totalPages };
  }
}
