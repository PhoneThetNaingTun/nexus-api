import { Test, TestingModule } from '@nestjs/testing';
import { MedicalPackageItemsService } from './medical-package-items.service';

describe('MedicalPackageItemsService', () => {
  let service: MedicalPackageItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalPackageItemsService],
    }).compile();

    service = module.get<MedicalPackageItemsService>(MedicalPackageItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
