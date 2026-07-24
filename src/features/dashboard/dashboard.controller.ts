import { Controller, Get, Query } from '@nestjs/common';
import { User } from '../auth/decorators/get-user.decorators';
import { type JWTPayload } from '../auth/strategry/jwt.strategy';
import { DashboardService } from './dashboard.service';
import { DashboardSummaryQueryDto } from './dto/dashboard-summary-query.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary(
    @Query() query: DashboardSummaryQueryDto,
    @User() user: JWTPayload,
  ) {
    return this.dashboardService.getSummary(query.date, user);
  }
}
