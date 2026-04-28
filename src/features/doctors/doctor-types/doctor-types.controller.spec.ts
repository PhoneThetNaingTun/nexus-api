import { Test, TestingModule } from '@nestjs/testing';
import { DoctorTypesController } from './doctor-types.controller';
import { DoctorTypesService } from './doctor-types.service';

describe('DoctorTypesController', () => {
  let controller: DoctorTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorTypesController],
      providers: [DoctorTypesService],
    }).compile();

    controller = module.get<DoctorTypesController>(DoctorTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
