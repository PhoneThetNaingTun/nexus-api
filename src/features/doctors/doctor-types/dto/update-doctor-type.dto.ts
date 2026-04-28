import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorTypeDto } from '.';

export class UpdateDoctorTypeDto extends PartialType(CreateDoctorTypeDto) {}
