import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/role.decorators';
import { RoleGuard } from '../auth/guards/role.guard';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from './dto';
import { MedicalRecordsService } from './medical-records.service';

@UseGuards(RoleGuard)
@Roles('ADMIN', 'DOCTOR')
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post('create')
  async create(@Body() dto: CreateMedicalRecordDto) {
    return await this.medicalRecordsService.createOne(dto);
  }

  @Patch(':id')
  async update(@Body() dto: UpdateMedicalRecordDto, @Param('id') id: string) {
    return await this.medicalRecordsService.updateOne(id, dto);
  }
}
