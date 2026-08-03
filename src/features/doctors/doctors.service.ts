import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import argon from 'argon2';
import { Prisma } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateDoctorDto, DoctorListQueryDto, UpdateDoctorDto } from './dto';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
        type: true,
        schedules: {
          where: {
            isActive: true,
          },
        },
      },
    });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return { data: doctor };
  }

  async createOne(dto: CreateDoctorDto) {
    const { name, email, password, type_id, bio, fee, image_url } = dto;
    const isUserExist = await this.prisma.user.findUnique({
      where: { email },
    });

    if (isUserExist) {
      throw new ConflictException('User already exist');
    }

    const hashedPassword = await argon.hash(password);
    const doctor = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'DOCTOR',
          image: image_url,
        },
      });
      const doctorProfile = await tx.doctorProfile.create({
        data: {
          user_id: user.id,
          type_id,
          bio,
          fee,
        },
      });
      return doctorProfile;
    });

    return { data: doctor };
  }

  async updateOne(id: string, dto: UpdateDoctorDto) {
    const { name, type_id, bio, fee, image_url } = dto;
    const { data } = await this.findOne(id);

    const updatedDoctor = await this.prisma.$transaction(async (tx) => {
      const updatedDoctor = await tx.doctorProfile.update({
        where: { id: data.id },
        data: {
          type_id,
          bio,
          fee,
        },
      });
      await tx.user.update({
        where: { id: data.user.id },
        data: {
          name,
          image: image_url,
        },
      });
      return updatedDoctor;
    });
    return { data: updatedDoctor };
  }

  async softDeleteOne(id: string) {
    const { data } = await this.findOne(id);

    const deletedDoctor = await this.prisma.$transaction(async (tx) => {
      const deletedDoctor = await this.prisma.doctorProfile.update({
        where: { id: data.id },
        data: { deletedAt: new Date() },
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      });
      await tx.user.update({
        where: { id: deletedDoctor.user.id },
        data: { deletedAt: new Date() },
      });
      return deletedDoctor;
    });

    return { data: deletedDoctor };
  }

  async findAll(pagination: PaginationDto, query: DoctorListQueryDto) {
    const { search } = query;
    const { pageSize, skip } = pagination;

    const searchFilter = search
      ? {
          OR: [
            {
              user: {
                name: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
                email: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              type: {
                name: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            },
          ],
        }
      : {};

    const where: Prisma.DoctorProfileWhereInput = {
      ...searchFilter,
      deletedAt: null,
    };

    const doctors = await this.prisma.doctorProfile.findMany({
      where: where,
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
        type: true,
      },
    });
    const totalCount = await this.prisma.doctorProfile.count({
      where: where,
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    return { data: doctors, totalCount, totalPages };
  }
}
