import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDoctorTypeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
