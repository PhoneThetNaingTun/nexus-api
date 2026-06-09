import { IsEnum, IsNotEmpty } from 'class-validator';
import { PackageStatus } from 'generated/prisma/enums';

export class ConfirmUserPackageDto {
  @IsEnum(PackageStatus)
  @IsNotEmpty()
  status!: PackageStatus;
}
