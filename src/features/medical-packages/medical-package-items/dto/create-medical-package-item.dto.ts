import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMedicalPackageItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
