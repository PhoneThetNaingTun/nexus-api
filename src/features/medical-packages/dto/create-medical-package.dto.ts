import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateMedicalPackageDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price!: number;

  @IsBoolean()
  @IsNotEmpty()
  isActive!: boolean;

  @IsArray()
  @IsString({ each: true })
  medicalPackageItemIds!: string[];
}
