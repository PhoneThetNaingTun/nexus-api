import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { MedicineForm } from 'generated/prisma/enums';

export class CreateMedicineDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  strength!: string;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsEnum(MedicineForm)
  @IsNotEmpty()
  form!: MedicineForm;

  @IsString()
  @IsNotEmpty()
  brandId!: string;

  @IsBoolean()
  requiresPrescription!: boolean;

  @IsString()
  @IsOptional()
  sideEffects?: string;
}
