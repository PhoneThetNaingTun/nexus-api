import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class GetAvaliableDoctorScheduleQueryDto {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date!: Date;
}
