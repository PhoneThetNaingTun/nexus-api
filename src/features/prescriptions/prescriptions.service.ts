import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from './dto';

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) {
      throw new NotFoundException('Prescription not found!');
    }
    return { data: prescription };
  }

  async createOne(dto: CreatePrescriptionDto) {
    const prescription = await this.prisma.prescription.create({
      data: dto,
    });

    return { data: prescription };
  }

  async updateOne(id: string, dto: UpdatePrescriptionDto) {
    const { data: prescription } = await this.findOne(id);

    const updatedPrescription = await this.prisma.prescription.update({
      where: { id: prescription.id },
      data: dto,
    });

    return { data: prescription };
  }

  async deleteOne(id: string) {
    const { data: prescription } = await this.findOne(id);

    const deletedPrescription = await this.prisma.prescription.delete({
      where: { id: prescription.id },
    });
    return { data: deletedPrescription };
  }
}
