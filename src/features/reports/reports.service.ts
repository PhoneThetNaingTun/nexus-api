import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { GetReportsDto } from './dto/get-reports.dto';
import { Prisma } from 'generated/prisma/client';

export interface ReportAggregation {
  date: string;
  revenue: number;
  count: number;
}

export interface SalesReport {
  overall: {
    revenue: number;
    count: number;
  };
  daily: ReportAggregation[];
  monthly: ReportAggregation[];
  yearly: ReportAggregation[];
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSalesReports(dto: GetReportsDto) {
    const { startDate, endDate } = dto;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const packageStatuses = ['PURCHASED', 'USED', 'EXPIRED'];

    // 1. Overall Total
    // Package revenue
    const packageOverall = await this.prisma.userPackage.aggregate({
      where: {
        purchaseDate: { gte: start, lte: end },
        status: { in: packageStatuses as any },
      },
      _sum: { purchasedPrice: true },
      _count: true,
    });

    // Appointment revenue
    const appointmentOverall = await this.prisma.$queryRaw<any[]>`
      SELECT
        SUM(dp."fee") as revenue,
        COUNT(*) as count
      FROM "Appointment" a
      JOIN "DoctorProfile" dp ON a."doctorId" = dp.id
      WHERE a."appointmentTime" >= ${start} AND a."appointmentTime" <= ${end}
        AND a."status" = 'COMPLETED'
    `;

    const appOverall = appointmentOverall[0] || { revenue: 0, count: 0 };

    // 2. Time-based Aggregations
    const daily = await this.aggregateByPeriod(
      'day',
      start,
      end,
      packageStatuses,
    );
    const monthly = await this.aggregateByPeriod(
      'month',
      start,
      end,
      packageStatuses,
    );
    const yearly = await this.aggregateByPeriod(
      'year',
      start,
      end,
      packageStatuses,
    );

    return {
      data: {
        overall: {
          revenue:
            (packageOverall._sum.purchasedPrice || 0) +
            (Number(appOverall.revenue) || 0),
          count: (packageOverall._count || 0) + (Number(appOverall.count) || 0),
        },
        daily,
        monthly,
        yearly,
      },
    };
  }

  private async aggregateByPeriod(
    period: 'day' | 'month' | 'year',
    start: Date,
    end: Date,
    packageStatuses: string[],
  ) {
    const results = await this.prisma.$queryRaw<any[]>`
      SELECT
        date,
        SUM(revenue)::float as revenue,
        SUM(count)::int as count
      FROM (
        SELECT
          DATE_TRUNC(${period}, "purchaseDate") as date,
          "purchasedPrice" as revenue,
          1 as count
        FROM "UserPackage"
        WHERE "purchaseDate" >= ${start} AND "purchaseDate" <= ${end}
          AND "status" IN (${Prisma.join(packageStatuses)})

        UNION ALL

        SELECT
          DATE_TRUNC(${period}, a."appointmentTime") as date,
          dp."fee" as revenue,
          1 as count
        FROM "Appointment" a
        JOIN "DoctorProfile" dp ON a."doctorId" = dp.id
        WHERE a."appointmentTime" >= ${start} AND a."appointmentTime" <= ${end}
          AND a."status" = 'COMPLETED'
      ) combined
      GROUP BY date
      ORDER BY date ASC
    `;

    return {
      data: (results || []).map((row) => ({
        date: row.date,
        revenue: Number(row.revenue) || 0,
        count: Number(row.count) || 0,
      })),
    };
  }
}
