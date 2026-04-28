import { IsString } from 'class-validator';

export class AppointmentRejectDto {
  @IsString()
  id!: string;
}
