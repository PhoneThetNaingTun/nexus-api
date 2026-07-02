import { Injectable, NotFoundException } from '@nestjs/common';
import { PackageStatus, Prisma } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { UserPackageListQueryDto } from './dto';
import { UserPackagesRepository } from './user-packages.repository';

@Injectable()
export class UserPackagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userPackagesRepository: UserPackagesRepository,
  ) {}

  async findOne(id: string) {
    const userPackage = await this.prisma.userPackage.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            name: true,
            email: true,
          },
        },
        package: true,
        medicalRecord: {
          include: {
            prescriptions: {
              include: {
                medicine: {
                  include: {
                    brand: true,
                    category: true,
                  },
                },
              },
            },
            doctor: true,
          },
        },
      },
    });
    if (!userPackage) {
      throw new NotFoundException('User package not found');
    }
    return { data: userPackage };
  }

  async findAll(pagination: PaginationDto, query: UserPackageListQueryDto) {
    const { search, status, purchaseDate } = query;
    const { pageSize, skip } = pagination;

    const where: Prisma.UserPackageWhereInput = {
      ...(search && {
        OR: [
          { id: { contains: search, mode: 'insensitive' } },
          { patient: { name: { contains: search, mode: 'insensitive' } } },
          { patient: { email: { contains: search, mode: 'insensitive' } } },
          { package: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
      ...(status && { status }),
      ...(purchaseDate && {
        purchaseDate: {
          gte: new Date(purchaseDate.setHours(0, 0, 0, 0)),
          lte: new Date(purchaseDate.setHours(23, 59, 59, 999)),
        },
      }),
    };

    const userPackages = await this.prisma.userPackage.findMany({
      where: where,
      skip,
      take: pageSize,

      orderBy: {
        purchaseDate: 'asc',
      },
      include: {
        patient: {
          select: {
            name: true,
            email: true,
          },
        },
        package: true,
      },
    });
    const totalCount = await this.prisma.userPackage.count({
      where: where,
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    return { data: userPackages, totalCount, totalPages };
  }

  async confirmPackage(packageId: string) {
    const { data } = await this.findOne(packageId);

    const updatedUserPackage = await this.userPackagesRepository.updateStatus(
      data.id,
      PackageStatus.PURCHASED,
    );
    return { data: updatedUserPackage };
  }

  async rejectPackage(packageId: string) {
    const { data } = await this.findOne(packageId);

    const updatedUserPackage = await this.userPackagesRepository.updateStatus(
      data.id,
      PackageStatus.REJECTED,
    );
    return { data: updatedUserPackage };
  }
}
