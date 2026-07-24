import { Controller, Get, Query } from '@nestjs/common';
import { Roles } from '../auth/decorators/role.decorators';
import { GetReportsDto } from './dto/get-reports.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @Roles('ADMIN')
  async getSalesReports(@Query() dto: GetReportsDto) {
    return await this.reportsService.getSalesReports(dto);
  }
}
