import { Module } from '@nestjs/common';
import { MedicalPackagesService } from './medical-packages.service';
import { MedicalPackagesController } from './medical-packages.controller';
import { MedicalPackageItemsModule } from './medical-package-items/medical-package-items.module';

@Module({
  controllers: [MedicalPackagesController],
  providers: [MedicalPackagesService],
  imports: [MedicalPackageItemsModule],
})
export class MedicalPackagesModule {}
