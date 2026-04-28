import { Module } from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { MedicinesController } from './medicines.controller';
import { BrandModule } from './brand/brand.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  controllers: [MedicinesController],
  providers: [MedicinesService],
  imports: [BrandModule, CategoriesModule],
})
export class MedicinesModule {}
