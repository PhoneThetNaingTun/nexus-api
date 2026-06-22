import { Test, TestingModule } from '@nestjs/testing';
import { MedicalPackageHistoryController } from './medical-package-history.controller';
import { MedicalPackageHistoryService } from './medical-package-history.service';

describe('MedicalPackageHistoryController', () => {
  let controller: MedicalPackageHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalPackageHistoryController],
      providers: [MedicalPackageHistoryService],
    }).compile();

    controller = module.get<MedicalPackageHistoryController>(MedicalPackageHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
