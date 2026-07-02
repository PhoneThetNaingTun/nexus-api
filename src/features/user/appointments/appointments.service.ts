import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import { Prisma } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/dto';
import { JWTPayload } from 'src/features/auth/strategry/jwt.strategy';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateAppointmentDto, UserAppointmentListQueryDto } from './dto';

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

  async create(user: JWTPayload, dto: CreateAppointmentDto) {
    const { doctorId, appointmentTime, notes } = dto;
    const time = new Date(appointmentTime);
    const isExist = await this.prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentTime: time,
      },
    });

    if (isExist) {
      throw new ConflictException(
        'This appointment time has been booked by other user!',
      );
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        patientId: user.sub,
        doctorId,
        appointmentTime: time,
        notes,
      },
    });

    return { data: appointment };
  }

  async findAllByUser(
    user: JWTPayload,
    paginationDto: PaginationDto,
    query: UserAppointmentListQueryDto,
  ) {
    const { date, status } = query;
    const { sub } = user;
    const { skip, pageSize } = paginationDto;

    const where: Prisma.AppointmentWhereInput = {
      patientId: sub,
      ...(status && { status }),
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
                name: true,
                email: true,
              },
            },
            type: true,
          },
        },
      },
    });
    const totalCount = await this.prisma.appointment.count({
      where: where,
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    return { data: appointments, totalCount, totalPages };
  }
}
