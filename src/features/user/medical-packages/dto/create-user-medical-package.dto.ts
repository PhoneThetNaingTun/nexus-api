import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserMedicalPackageDto {
  @IsString()
  @IsNotEmpty()
  packageId!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'paymentScreenshot must not be blank' })
  paymentScreenshot!: string;
}
