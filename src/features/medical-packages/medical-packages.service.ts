import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import {
  CreateMedicalPackageDto,
  MedicalPackageListQueryDto,
  UpdateMedicalPackageDto,
} from './dto';

@Injectable()
export class MedicalPackagesService {
  constructor(private readonly prisma: PrismaService) {}
  async findOne(id: string) {
    const medicalPackage = await this.prisma.medicalPackage.findUnique({
      where: { id },
    });
    if (!medicalPackage) {
      throw new NotFoundException('Medical package not found');
    }
    return { data: medicalPackage };
  }

  async createOne(dto: CreateMedicalPackageDto) {
    const { medicalPackageItemIds, ...rest } = dto;
    const medicalPackage = await this.prisma.medicalPackage.create({
      data: {
        ...rest,
        medicalPackageItems: {
          connect: medicalPackageItemIds.map((id) => ({ id })),
        },
      },
    });
    return { data: medicalPackage };
  }
  async updateOne(id: string, dto: UpdateMedicalPackageDto) {
    const { data } = await this.findOne(id);

    const { medicalPackageItemIds, ...rest } = dto;

    const updatedMedicalPackage = await this.prisma.medicalPackage.update({
      where: { id: data.id },
      data: {
        ...rest,
        ...(medicalPackageItemIds && {
          medicalPackageItems: {
            set: medicalPackageItemIds.map((id) => ({ id })),
          },
        }),
      },
    });
    return { data: updatedMedicalPackage };
  }

  async softDeleteOne(id: string) {
    const { data } = await this.findOne(id);
    const deleteMedicalPackage = await this.prisma.medicalPackage.update({
      where: { id: data.id },
      data: { deletedAt: new Date() },
    });
    return { data: deleteMedicalPackage };
  }

  async findAll(pagination: PaginationDto, query: MedicalPackageListQueryDto) {
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

    const where: Prisma.MedicalPackageWhereInput = {
      ...searchFilter,
      deletedAt: null,
    };

    const medicalPackages = await this.prisma.medicalPackage.findMany({
      where: where,
      skip,
      take: pageSize,
      include: {
        medicalPackageItems: true,
      },
    });
    const totalCount = await this.prisma.medicalPackage.count({
      where: where,
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    return { data: medicalPackages, totalCount, totalPages };
  }
}
