import { Injectable, NotFoundException } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import { AppointmentStatus, Prisma, Role } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { JWTPayload } from '../auth/strategry/jwt.strategy';
import {
  AppointmentApproveDto,
  AppointmentRejectDto,
  AppointmentUpdateStatusDto,
} from './dto';
import { AppointmentListQueryDto } from './dto/appointmnt-list-query.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: {
        id: id,
      },
      include: {
        patient: {
          select: {
            image: true,
            name: true,
            email: true,
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                image: true,
                name: true,
                email: true,
              },
            },
            type: true,
          },
        },
        medicalRecord: {
          include: {
            prescriptions: {
              include: {
                medicine: {
                  include: {
                    brand: true,
                    category: true,
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
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return { data: appointment };
  }

  async approve(dto: AppointmentApproveDto) {
    const { id } = dto;
    const { data } = await this.findOne(id);

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: data.id },
      data: { status: 'CONFIRMED' },
    });
    return { data: updatedAppointment };
  }
  async reject(dto: AppointmentRejectDto) {
    const { id } = dto;
    const { data } = await this.findOne(id);

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: data.id },
      data: { status: 'CANCELLED' },
    });
    return { data: updatedAppointment };
  }

  async updateStatus(id: string, dto: AppointmentUpdateStatusDto) {
    const { data } = await this.findOne(id);
    const now = new Date();

    const timingData: Prisma.AppointmentUpdateInput = {};
    if (dto.status === AppointmentStatus.CHECKING && !data.actualStartTime) {
      timingData.actualStartTime = now;
    }
    if (dto.status === AppointmentStatus.COMPLETED && !data.actualEndTime) {
      timingData.actualEndTime = now;
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: data.id },
      data: { status: dto.status, ...timingData },
    });
    return { data: updatedAppointment };
  }
  async findAll(
    pagination: PaginationDto,
    query: AppointmentListQueryDto,
    user: JWTPayload,
  ) {
    const { search, status, date } = query;
    const { pageSize, skip } = pagination;

    const isDoctor = user.role === Role.DOCTOR;

    const doctor = await this.prisma.doctorProfile.findFirst({
      where: {
        user_id: user.sub,
      },
    });
    if (isDoctor && !doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const where: Prisma.AppointmentWhereInput = {
      ...(search && {
        OR: [
          {
            doctor: {
              user: {
                OR: [
                  {
                    name: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    email: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          },
          {
            patient: {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          },
        ],
      }),

      ...(status && { status }),

      ...(isDoctor && {
        doctorId: doctor?.id,
      }),
    };

    if (date) {
      where.appointmentTime = {
        gte: startOfDay(date),
        lte: endOfDay(date),
      };
    }

    const appointments = await this.prisma.appointment.findMany({
      where: where,
      skip,
      take: pageSize,
      include: {
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    const totalCount = await this.prisma.appointment.count({
      where: where,
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    return { data: appointments, totalCount, totalPages };
  }
}
