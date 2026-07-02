import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from 'generated/prisma/enums';

export class AppointmentUpdateStatusDto {
  @IsEnum(AppointmentStatus)
  @IsNotEmpty()
  status!: AppointmentStatus;
}
