import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMedicalRecordDto {
  @IsString()
  @IsNotEmpty()
  doctorId!: string;

  @IsString()
  @IsNotEmpty()
  patientId!: string;

  @IsString()
  @IsOptional()
  appointmentId?: string;

  @IsString()
  @IsNotEmpty()
  diagnosis!: string;

  @IsString()
  @IsNotEmpty()
  symptoms!: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  bloodPressure?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  followUpDate?: Date;

  @IsString()
  @IsOptional()
  advice?: string;

  @IsString()
  @IsOptional()
  userPackageId?: string;
}
