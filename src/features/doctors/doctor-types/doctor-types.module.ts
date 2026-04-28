import { Module } from '@nestjs/common';
import { DoctorTypesService } from './doctor-types.service';
import { DoctorTypesController } from './doctor-types.controller';

@Module({
  controllers: [DoctorTypesController],
  providers: [DoctorTypesService],
})
export class DoctorTypesModule {}
