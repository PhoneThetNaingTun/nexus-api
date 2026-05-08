import { Module } from '@nestjs/common';
import { MedicalPackagesService } from './medical-packages.service';
import { MedicalPackagesController } from './medical-packages.controller';

@Module({
  controllers: [MedicalPackagesController],
  providers: [MedicalPackagesService],
})
export class MedicalPackagesModule {}
