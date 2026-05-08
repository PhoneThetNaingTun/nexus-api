import { Test, TestingModule } from '@nestjs/testing';
import { MedicalPackagesService } from './medical-packages.service';

describe('MedicalPackagesService', () => {
  let service: MedicalPackagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalPackagesService],
    }).compile();

    service = module.get<MedicalPackagesService>(MedicalPackagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
