import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto';
import { User } from 'src/features/auth/decorators/get-user.decorators';
import { type JWTPayload } from 'src/features/auth/strategry/jwt.strategy';
import { UserMedicalPackageListQuery } from './decorators/medical-package-list-query.decorator';
import { UserMedicalPackageListQueryDto } from './dto';
import { CreateUserMedicalPackageDto } from './dto/create-user-medical-package.dto';
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.medicalPackagesService.findOne(id);
  }
  @Post('buy')
  async buyMedicalPackage(
    @User() user: JWTPayload,
    @Body() dto: CreateUserMedicalPackageDto,
  ) {
    return await this.medicalPackagesService.buyMedicalPackage(user, dto);
  }
}
