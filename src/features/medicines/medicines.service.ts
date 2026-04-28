import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateMedicineDto, UpdateMedicineDto } from './dto';
import { MedicineListQueryDto } from './dto/list-medicine-query.dto';

@Injectable()
export class MedicinesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const medicine = await this.prisma.medicine.findUnique({
      where: { id },
    });
    if (!medicine) {
      throw new NotFoundException('Medicine not found');
    }
    return { data: medicine };
  }

  async createOne(dto: CreateMedicineDto) {
    const medicine = await this.prisma.medicine.create({
      data: dto,
    });
    return { data: medicine };
  }

  async updateOne(id: string, dto: UpdateMedicineDto) {
    const { data } = await this.findOne(id);

    const updatedMedicine = await this.prisma.medicine.update({
      where: { id: data.id },
      data: dto,
    });
    return { data: updatedMedicine };
  }

  async softDeleteOne(id: string) {
    const { data } = await this.findOne(id);
    const deletedMedicine = await this.prisma.medicine.update({
      where: { id: data.id },
      data: { deletedAt: new Date() },
    });
    return { data: deletedMedicine };
  }

  async findAll(pagination: PaginationDto, query: MedicineListQueryDto) {
    const { search } = query;
    const { pageSize, skip } = pagination;

    const searchFilter = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
            {
              brand: {
                name: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            },
            {
              category: {
                name: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            },
          ],
        }
      : {};

    const where: Prisma.MedicineWhereInput = {
      ...searchFilter,
      deletedAt: null,
    };

    const medicines = await this.prisma.medicine.findMany({
      where: where,
      skip,
      take: pageSize,
      include: {
        brand: true,
        category: true,
      },
    });
    const totalCount = await this.prisma.medicine.count({
      where: where,
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    return { data: medicines, totalCount, totalPages };
  }
}
