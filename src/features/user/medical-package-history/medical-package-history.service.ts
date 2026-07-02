import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/dto';
import { JWTPayload } from 'src/features/auth/strategry/jwt.strategy';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { MedicalPackageHistoryListDto } from './dto';

@Injectable()
export class MedicalPackageHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const medicalPackage = await this.prisma.userPackage.findUnique({
      where: { id: id },
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
            doctor: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
                type: true,
              },
            },
          },
        },
      },
    });
    if (!medicalPackage) {
      throw new NotFoundException('Medical package not found');
    }
    return { data: medicalPackage };
  }
  async findAll(
    user: JWTPayload,
    pagination: PaginationDto,
    query: MedicalPackageHistoryListDto,
  ) {
    const { search } = query;
    const { pageSize, skip } = pagination;

    const where: Prisma.UserPackageWhereInput = {
      ...(search && {
        OR: [
          { id: { contains: search, mode: 'insensitive' } },
          { package: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
      patientId: user.sub,
    };
    const medicalPackages = await this.prisma.userPackage.findMany({
      where: where,
      skip,
      take: pageSize,
      orderBy: {
        purchaseDate: 'asc',
      },
    });
    const totalCount = await this.prisma.userPackage.count({
      where: where,
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    return { data: medicalPackages, totalCount, totalPages };
  }
}
