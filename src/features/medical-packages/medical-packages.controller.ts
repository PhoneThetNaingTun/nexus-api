import { Controller } from '@nestjs/common';
import { MedicalPackagesService } from './medical-packages.service';

@Controller('medical-packages')
export class MedicalPackagesController {
  constructor(private readonly medicalPackagesService: MedicalPackagesService) {}
}
