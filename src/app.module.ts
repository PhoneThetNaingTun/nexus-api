import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/exceptions/http.exception';
import { PrismaExceptionFilter } from './common/exceptions/prisma.exception';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AppointmentsModule } from './features/appointments/appointments.module';
import { AuthModule } from './features/auth/auth.module';
import { JWTGuard } from './features/auth/guards/jwt.guard';
import { DoctorsModule } from './features/doctors/doctors.module';
import { MedicalPackagesModule } from './features/medical-packages/medical-packages.module';
import { MedicalRecordsModule } from './features/medical-records/medical-records.module';
import { MedicinesModule } from './features/medicines/medicines.module';
import { PrescriptionsModule } from './features/prescriptions/prescriptions.module';
import { AppointmentsModule as AdminAppointmentsModule } from './features/user/appointments/appointments.module';
import { MedicalPackagesModule as UserMedicalPackagesModule } from './features/user/medical-packages/medical-packages.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { UserPackagesModule } from './features/user-packages/user-packages.module';
import { MedicalPackageHistoryModule } from './features/user/medical-package-history/medical-package-history.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DoctorsModule,
    MedicinesModule,
    AppointmentsModule,
    AdminAppointmentsModule,
    MedicalRecordsModule,
    PrescriptionsModule,
    MedicalPackagesModule,
    UserMedicalPackagesModule,
    UserPackagesModule,
    MedicalPackageHistoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JWTGuard },
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
