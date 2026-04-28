import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  addMinutes,
  endOfDay,
  format,
  isSameSecond,
  parse,
  startOfDay,
} from 'date-fns';
import { Prisma } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import {
  CreateScheduleDto,
  GetAvaliableDoctorScheduleQueryDto,
  UpdateScheduleDto,
} from './dto';
import { ScheduleListQueryDto } from './dto/list-schedule-query.dto';

@Injectable()
export class SchedulesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: {
        id,
      },
    });
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    return { data: schedule };
  }

  async checkDoctorScheduleConflict(
    doctorId: string,
    dayOfWeek: number,
  ): Promise<boolean> {
    const schedules = await this.prisma.schedule.findMany({
      where: { doctor_id: doctorId },
    });
    const hasConflict = schedules.some(
      (schedule) => schedule.dayOfWeek === dayOfWeek,
    );
    return hasConflict;
  }

  async createOne(doctorId: string, dto: CreateScheduleDto) {
    const isExist = await this.checkDoctorScheduleConflict(
      doctorId,
      dto.dayOfWeek,
    );
    if (isExist) {
      throw new ConflictException(
        'Schedule conflict: Doctor already has a schedule for this day of the week',
      );
    }
    const schedule = await this.prisma.schedule.create({
      data: {
        doctor_id: doctorId,
        ...dto,
      },
    });
    return { data: schedule };
  }

  async updateOne(id: string, dto: UpdateScheduleDto) {
    const { data } = await this.findOne(id);

    const updatedSchedule = await this.prisma.schedule.update({
      where: {
        id: data.id,
      },
      data: dto,
    });
    return { data: updatedSchedule };
  }

  async deleteOne(id: string) {
    const { data } = await this.findOne(id);
    const deletedSchedule = await this.prisma.schedule.delete({
      where: { id: data.id },
    });
    return { data: deletedSchedule };
  }

  async findListByDoctorId(
    doctorId: string,
    pagination: PaginationDto,
    query: ScheduleListQueryDto,
  ) {
    const { search } = query;
    const { pageSize, skip } = pagination;

    const where: Prisma.ScheduleWhereInput = {
      doctor_id: doctorId,
      deletedAt: null,
    };

    const schedules = await this.prisma.schedule.findMany({
      where: where,
      skip,
      take: pageSize,
    });
    const totalCount = await this.prisma.schedule.count({ where });
    const totalPages = Math.ceil(totalCount / pageSize);
    return { data: schedules, totalCount, totalPages };
  }

  async getAvailableSchedule(
    doctorId: string,
    query: GetAvaliableDoctorScheduleQueryDto,
  ) {
    const { date } = query;
    const dayOfWeek = date.getDay();

    const schedule = await this.prisma.schedule.findFirst({
      where: {
        doctor_id: doctorId,
        dayOfWeek: dayOfWeek,
        isActive: true,
      },
    });

    if (!schedule) return { data: [] };

    const takenAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId: doctorId,
        appointmentTime: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        status: { notIn: ['CANCELLED'] },
      },
      select: { appointmentTime: true },
    });

    const slots: {
      time: string;
      appointmentTime: string;
      available: boolean;
    }[] = [];

    let currentSlot = parse(schedule.startTime, 'HH:mm', date);
    const endTime = parse(schedule.endTime, 'HH:mm', date);

    while (currentSlot < endTime) {
      const isTaken = takenAppointments.some((appointment) =>
        isSameSecond(appointment.appointmentTime, currentSlot),
      );

      slots.push({
        time: format(currentSlot, 'HH:mm'),
        appointmentTime: currentSlot.toISOString(),
        available: !isTaken,
      });

      currentSlot = addMinutes(currentSlot, schedule.slotDuration);
    }

    return { data: slots };
  }
}
