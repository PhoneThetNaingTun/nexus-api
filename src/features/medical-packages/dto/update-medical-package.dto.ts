import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalPackageDto } from './create-medical-package.dto';

export class UpdateMedicalPackageDto extends PartialType(
  CreateMedicalPackageDto,
) {}
