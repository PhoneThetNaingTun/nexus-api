import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from 'generated/prisma/client';
import { SearchDto } from 'src/common/dto/search.dto';

export class AppointmentListQueryDto extends SearchDto {
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  date?: Date;
}
