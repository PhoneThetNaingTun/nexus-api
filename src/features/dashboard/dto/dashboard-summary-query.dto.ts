import { IsDateString } from 'class-validator';

export class DashboardSummaryQueryDto {
  @IsDateString()
  date!: string;
}
