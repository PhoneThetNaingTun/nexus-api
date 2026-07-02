import { Controller, Get, Param } from '@nestjs/common';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto';
import { User } from 'src/features/auth/decorators/get-user.decorators';
import { type JWTPayload } from 'src/features/auth/strategry/jwt.strategy';
import { MedicalPackageHistoryListQuery } from './decorators/medical-package-history-list-query.decorator';
import { MedicalPackageHistoryListDto } from './dto';
import { MedicalPackageHistoryService } from './medical-package-history.service';

@Controller('/user/medical-package-history')
export class MedicalPackageHistoryController {
  constructor(
    private readonly medicalPackageHistoryService: MedicalPackageHistoryService,
  ) {}

  @Get('list')
  async findAll(
    @User() user: JWTPayload,
    @Pagination() pagination: PaginationDto,
    @MedicalPackageHistoryListQuery() query: MedicalPackageHistoryListDto,
  ) {
    return await this.medicalPackageHistoryService.findAll(
      user,
      pagination,
      query,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.medicalPackageHistoryService.findOne(id);
  }
}
