import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import {
  CreateDoctorTypeDto,
  ListDoctorTypeQueryDto,
  UpdateDoctorTypeDto,
} from './dto';

@Injectable()
export class DoctorTypesService {
  constructor(private readonly prisma: PrismaService) {}
  async findOne(id: string) {
    const doctorType = await this.prisma.doctorType.findUnique({
      where: { id },
    });
    if (!doctorType) {
      throw new NotFoundException('Doctor type not found');
    }
    return doctorType;
  }

  async crateOne(dot: CreateDoctorTypeDto) {
    return this.prisma.doctorType.create({ data: dot });
  }
  async updateOne(id: string, dot: UpdateDoctorTypeDto) {
    return this.prisma.doctorType.update({ where: { id }, data: dot });
  }

  async softDeleteOne(id: string) {
    return this.prisma.doctorType.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async deleteOne(id: string) {
    return this.prisma.doctorType.delete({ where: { id } });
  }

  async findAll(pagination: PaginationDto, query: ListDoctorTypeQueryDto) {
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

    let where: Prisma.DoctorTypeWhereInput = {
      ...searchFilter,
      deletedAt: null,
    };

    const doctorTypes = await this.prisma.doctorType.findMany({
      where: where,
      skip,
      take: pageSize,
    });
    const totalCount = await this.prisma.doctorType.count({
      where: where,
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    return { data: doctorTypes, totalCount, totalPages };
  }
}
