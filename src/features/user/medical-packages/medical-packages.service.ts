import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { UserMedicalPackageListQueryDto } from './dto';

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

  async findAll(
    pagination: PaginationDto,
    query: UserMedicalPackageListQueryDto,
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

    const where: Prisma.MedicalPackageWhereInput = {
      ...searchFilter,
      isActive: true,
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
