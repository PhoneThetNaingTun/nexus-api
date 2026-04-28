import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorDto } from '.';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {}
