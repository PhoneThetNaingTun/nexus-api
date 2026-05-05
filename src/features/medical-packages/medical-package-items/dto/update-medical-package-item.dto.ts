import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalPackageItemDto } from './create-medical-package-item.dto';

export class UpdateMedicalPackageItemDto extends PartialType(
  CreateMedicalPackageItemDto,
) {}
