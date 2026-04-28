import { Test, TestingModule } from '@nestjs/testing';
import { DoctorTypesService } from './doctor-types.service';

describe('DoctorTypesService', () => {
  let service: DoctorTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorTypesService],
    }).compile();

    service = module.get<DoctorTypesService>(DoctorTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
