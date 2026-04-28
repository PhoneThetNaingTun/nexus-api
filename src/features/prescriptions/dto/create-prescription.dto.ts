import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePrescriptionDto {
  @IsString()
  @IsNotEmpty()
  medicalRecordId!: string;

  @IsString()
  @IsNotEmpty()
  medicineId!: string;

  @IsString()
  @IsNotEmpty()
  dosage!: string;

  @IsString()
  @IsNotEmpty()
  frequency!: string;

  @IsString()
  @IsNotEmpty()
  duration!: string;

  @IsNumber()
  @IsNotEmpty()
  totalQuantity!: number;

  @IsString()
  @IsOptional()
  instructions?: string;
}
