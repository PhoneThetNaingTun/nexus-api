import { Test, TestingModule } from '@nestjs/testing';
import { MedicalPackageItemsController } from './medical-package-items.controller';
import { MedicalPackageItemsService } from './medical-package-items.service';

describe('MedicalPackageItemsController', () => {
  let controller: MedicalPackageItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalPackageItemsController],
      providers: [MedicalPackageItemsService],
    }).compile();

    controller = module.get<MedicalPackageItemsController>(MedicalPackageItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
