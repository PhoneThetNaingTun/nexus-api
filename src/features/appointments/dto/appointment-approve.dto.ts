import { IsString } from 'class-validator';

export class AppointmentApproveDto {
  @IsString()
  id!: string;
}
