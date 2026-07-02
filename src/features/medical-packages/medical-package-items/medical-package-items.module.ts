import { Module } from '@nestjs/common';
import { MedicalPackageItemsService } from './medical-package-items.service';
import { MedicalPackageItemsController } from './medical-package-items.controller';

@Module({
  controllers: [MedicalPackageItemsController],
  providers: [MedicalPackageItemsService],
})
export class MedicalPackageItemsModule {}
