import { Module } from '@nestjs/common';
import { DoctorTypesModule } from './doctor-types/doctor-types.module';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  controllers: [DoctorsController],
  providers: [DoctorsService],
  imports: [DoctorTypesModule, SchedulesModule],
})
export class DoctorsModule {}
