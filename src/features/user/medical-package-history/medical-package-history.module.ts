import { Module } from '@nestjs/common';
import { MedicalPackageHistoryService } from './medical-package-history.service';
import { MedicalPackageHistoryController } from './medical-package-history.controller';

@Module({
  controllers: [MedicalPackageHistoryController],
  providers: [MedicalPackageHistoryService],
})
export class MedicalPackageHistoryModule {}
