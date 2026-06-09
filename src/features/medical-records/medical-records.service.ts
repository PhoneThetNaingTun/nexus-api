import { Injectable, NotFoundException } from '@nestjs/common';
import { PackageStatus } from 'generated/prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from './dto';

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const medicalRecord = await this.prisma.medicalRecord.findUnique({
      where: { id },
    });

    if (!medicalRecord) {
      throw new NotFoundException('Medical record not found');
    }
    return { data: medicalRecord };
  }

  async createOne(dto: CreateMedicalRecordDto) {
    const {
      appointmentId,
      diagnosis,
      symptoms,
      weight,
      bloodPressure,
      followUpDate,
      advice,
      doctorId,
      patientId,
      userPackageId,
    } = dto;
    const medicalRecord = await this.prisma.medicalRecord.create({
      data: {
        appointmentId,
        diagnosis,
        symptoms,
        weight,
        bloodPressure,
        followUpDate,
        advice,
        doctorId,
        patientId,
        userPackageId,
      },
    });

    if (userPackageId) {
      await this.prisma.userPackage.update({
        where: { id: userPackageId },
        data: { status: PackageStatus.USED },
      });
    }

    return { data: medicalRecord };
  }

  async updateOne(id: string, dto: UpdateMedicalRecordDto) {
    const { data: medicalRecord } = await this.findOne(id);

    const updatedMedicalRecord = await this.prisma.medicalRecord.update({
      where: { id: medicalRecord.id },
      data: dto,
    });

    return { data: updatedMedicalRecord };
  }
}
