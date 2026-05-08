import { Test, TestingModule } from '@nestjs/testing';
import { MedicalPackagesController } from './medical-packages.controller';
import { MedicalPackagesService } from './medical-packages.service';

describe('MedicalPackagesController', () => {
  let controller: MedicalPackagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalPackagesController],
      providers: [MedicalPackagesService],
    }).compile();

    controller = module.get<MedicalPackagesController>(MedicalPackagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
