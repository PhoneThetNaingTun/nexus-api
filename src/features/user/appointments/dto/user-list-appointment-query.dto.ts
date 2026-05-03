import { IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from 'generated/prisma/enums';
import { DateDto } from 'src/common/dto';

export class UserAppointmentListQueryDto extends DateDto {
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}
