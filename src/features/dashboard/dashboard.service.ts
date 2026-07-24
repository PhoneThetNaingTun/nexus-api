import { Injectable, NotFoundException } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import {
  AppointmentStatus,
  PackageStatus,
  Prisma,
  Role,
} from 'generated/prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { type JWTPayload } from '../auth/strategry/jwt.strategy';
import { mapStatusCounts } from './dashboard.utils';

const ACTIVE_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.PENDING,
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.CHECKING,
  AppointmentStatus.COMPLETED,
];

const REVENUE_PACKAGE_STATUSES: PackageStatus[] = [
  PackageStatus.PURCHASED,
  PackageStatus.USED,
  PackageStatus.EXPIRED,
];

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(date: string, jwt: JWTPayload) {
    const day = new Date(`${date}T00:00:00`);
    const start = startOfDay(day);
    const end = endOfDay(day);
    const now = new Date();
    const upcomingStart = now > start && now < end ? now : start;
    const isDoctor = jwt.role === Role.DOCTOR;

    const [user, doctor] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: jwt.sub },
        select: { name: true, email: true },
      }),
      isDoctor
        ? this.prisma.doctorProfile.findUnique({
            where: { user_id: jwt.sub },
            select: { id: true },
          })
        : Promise.resolve(null),
    ]);

    if (isDoctor && !doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const appointmentWhere: Prisma.AppointmentWhereInput = {
      appointmentTime: { gte: start, lte: end },
      status: { in: ACTIVE_STATUSES },
      ...(doctor ? { doctorId: doctor.id } : {}),
    };
    const upcomingWhere: Prisma.AppointmentWhereInput = {
      ...appointmentWhere,
      appointmentTime: { gte: upcomingStart, lte: end },
      status: {
        in: [
          AppointmentStatus.PENDING,
          AppointmentStatus.CONFIRMED,
          AppointmentStatus.CHECKING,
        ],
      },
    };

    const appointmentSelect = {
      id: true,
      appointmentTime: true,
      status: true,
      patient: { select: { name: true, email: true } },
      doctor: {
        select: { user: { select: { name: true, email: true } } },
      },
    } satisfies Prisma.AppointmentSelect;

    const commonQueries = Promise.all([
      this.prisma.appointment.groupBy({
        by: ['status'],
        where: appointmentWhere,
        _count: { _all: true },
      }),
      this.prisma.appointment.findMany({
        where: appointmentWhere,
        select: appointmentSelect,
        orderBy: { appointmentTime: 'asc' },
        take: 6,
      }),
      this.prisma.appointment.findMany({
        where: upcomingWhere,
        select: appointmentSelect,
        orderBy: { appointmentTime: 'asc' },
        take: 3,
      }),
      this.getHourlyAppointments(start, end, doctor?.id),
    ]);

    const adminQueries = isDoctor
      ? Promise.resolve(null)
      : Promise.all([
          this.prisma.userPackage.aggregate({
            where: {
              purchaseDate: { gte: start, lte: end },
              status: { in: REVENUE_PACKAGE_STATUSES },
            },
            _sum: { purchasedPrice: true },
          }),
          this.getCompletedAppointmentRevenue(start, end),
          this.prisma.userPackage.findMany({
            where: {
              purchaseDate: { gte: start, lte: end },
              status: { in: REVENUE_PACKAGE_STATUSES },
            },
            select: {
              id: true,
              purchasedPrice: true,
              purchaseDate: true,
              package: { select: { name: true } },
              patient: { select: { name: true, email: true } },
            },
            orderBy: { purchaseDate: 'desc' },
            take: 3,
          }),
        ]);

    const [[statusCounts, queue, upcoming, hourly], adminData] =
      await Promise.all([commonQueries, adminQueries]);
    const appointments = mapStatusCounts(statusCounts);
    const displayName = user?.name || user?.email || jwt.email;
    const common = {
      role: jwt.role,
      displayName,
      date,
      appointments: {
        ...appointments,
        hourly: hourly.map((item) => ({
          hour: Number(item.hour),
          count: Number(item.count),
        })),
        queue: queue.map((item) => this.mapAppointment(item)),
        upcoming: upcoming.map((item) => this.mapAppointment(item)),
      },
    };

    if (isDoctor) {
      return { data: common };
    }

    const [packageRevenue, appointmentRevenue, recentSales] = adminData!;
    return {
      data: {
        ...common,
        role: Role.ADMIN,
        admin: {
          revenue:
            Number(packageRevenue._sum.purchasedPrice || 0) +
            Number(appointmentRevenue),
          recentPackageSales: recentSales.map((sale) => ({
            id: sale.id,
            packageName: sale.package.name,
            patientName: sale.patient.name || sale.patient.email,
            purchasedPrice: sale.purchasedPrice,
            purchaseDate: sale.purchaseDate,
          })),
        },
      },
    };
  }

  private mapAppointment(appointment: {
    id: string;
    appointmentTime: Date;
    status: AppointmentStatus;
    patient: { name: string | null; email: string };
    doctor: { user: { name: string | null; email: string } };
  }) {
    return {
      id: appointment.id,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status,
      patientName: appointment.patient.name || appointment.patient.email,
      doctorName: appointment.doctor.user.name || appointment.doctor.user.email,
    };
  }

  private async getHourlyAppointments(
    start: Date,
    end: Date,
    doctorId?: string,
  ) {
    const doctorFilter = doctorId
      ? Prisma.sql`AND "doctorId" = ${doctorId}`
      : Prisma.empty;

    return this.prisma.$queryRaw<{ hour: number; count: bigint }[]>(Prisma.sql`
      SELECT EXTRACT(HOUR FROM "appointmentTime")::int AS hour,
             COUNT(*)::bigint AS count
      FROM "Appointment"
      WHERE "appointmentTime" >= ${start}
        AND "appointmentTime" <= ${end}
        AND status IN ('PENDING', 'CONFIRMED', 'CHECKING', 'COMPLETED')
        ${doctorFilter}
      GROUP BY hour
      ORDER BY hour ASC
    `);
  }

  private async getCompletedAppointmentRevenue(start: Date, end: Date) {
    const rows = await this.prisma.$queryRaw<{ revenue: number | null }[]>(
      Prisma.sql`
        SELECT COALESCE(SUM(dp.fee), 0)::float AS revenue
        FROM "Appointment" a
        JOIN "DoctorProfile" dp ON a."doctorId" = dp.id
        WHERE a."appointmentTime" >= ${start}
          AND a."appointmentTime" <= ${end}
          AND a.status = 'COMPLETED'
      `,
    );

    return Number(rows[0]?.revenue || 0);
  }
}
