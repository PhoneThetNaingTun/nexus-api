import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserMedicalPackageDto {
  @IsString()
  @IsNotEmpty()
  packageId!: string;

  @IsString()
  @IsOptional()
  paymentScreenshot?: string;
}
