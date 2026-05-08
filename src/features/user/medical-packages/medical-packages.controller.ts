import { Controller, Get } from '@nestjs/common';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto';
import { UserMedicalPackageListQuery } from './decorators/medical-package-list-query.decorator';
import { UserMedicalPackageListQueryDto } from './dto';
import { MedicalPackagesService } from './medical-packages.service';

@Controller('user/medical-packages')
export class MedicalPackagesController {
  constructor(
    private readonly medicalPackagesService: MedicalPackagesService,
  ) {}

  @Get('list')
  async findAll(
    @Pagination() pagination: PaginationDto,
    @UserMedicalPackageListQuery() query: UserMedicalPackageListQueryDto,
  ) {
    return await this.medicalPackagesService.findAll(pagination, query);
  }
}
