import { Test, TestingModule } from '@nestjs/testing';
import { MedicalPackageHistoryService } from './medical-package-history.service';

describe('MedicalPackageHistoryService', () => {
  let service: MedicalPackageHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalPackageHistoryService],
    }).compile();

    service = module.get<MedicalPackageHistoryService>(MedicalPackageHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
