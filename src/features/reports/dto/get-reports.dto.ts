import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetReportsDto {
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;
}
