import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/role.decorators';
import { RoleGuard } from '../auth/guards/role.guard';
import { CreatePrescriptionDto, UpdatePrescriptionDto } from './dto';
import { PrescriptionsService } from './prescriptions.service';

@UseGuards(RoleGuard)
@Roles('ADMIN', 'DOCTOR')
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post('create')
  async create(@Body() dto: CreatePrescriptionDto) {
    return await this.prescriptionsService.createOne(dto);
  }

  @Patch(':id')
  async update(@Body() dto: UpdatePrescriptionDto, @Param('id') id: string) {
    return await this.prescriptionsService.updateOne(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.prescriptionsService.deleteOne(id);
  }
}
