import { Injectable, NotFoundException } from '@nestjs/common';
import { addMonths } from 'date-fns';
import { Prisma } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/dto';
import { JWTPayload } from 'src/features/auth/strategry/jwt.strategy';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { UserMedicalPackageListQueryDto } from './dto';
import { CreateUserMedicalPackageDto } from './dto/create-user-medical-package.dto';

@Injectable()
export class MedicalPackagesService {
  constructor(private readonly prisma: PrismaService) {}
  async findOne(id: string) {
    const medicalPackage = await this.prisma.medicalPackage.findUnique({
      where: { id },
      include: {
        medicalPackageItems: true,
      },
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

  async buyMedicalPackage(user: JWTPayload, dto: CreateUserMedicalPackageDto) {
    const expiryDate = addMonths(new Date(), 1);

    const { data: medicalPackage } = await this.findOne(dto.packageId);

    const userMedicalPackage = await this.prisma.userPackage.create({
      data: {
        patientId: user.sub,
        packageId: dto.packageId,
        expiryDate: expiryDate,
        paymentScreenshot: dto.paymentScreenshot,
        purchasedPrice: medicalPackage.price,
      },
    });

    return { data: userMedicalPackage };
  }
}
