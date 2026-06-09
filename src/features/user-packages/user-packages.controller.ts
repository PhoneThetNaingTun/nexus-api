import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto';
import { Roles } from '../auth/decorators/role.decorators';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserPackageListQuery } from './decorators/user-package-list-query.decorator';
import { UserPackageListQueryDto } from './dto';
import { UserPackagesService } from './user-packages.service';

@Controller('user-packages')
@UseGuards(RoleGuard)
export class UserPackagesController {
  constructor(private readonly userPackagesService: UserPackagesService) {}

  @Get('/list')
  @Roles('ADMIN')
  findAll(
    @Pagination() pagination: PaginationDto,
    @UserPackageListQuery() query: UserPackageListQueryDto,
  ) {
    return this.userPackagesService.findAll(pagination, query);
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.userPackagesService.findOne(id);
  }

  @Post('/confirm/:id')
  @Roles('ADMIN')
  confirmPackage(@Param('id') id: string) {
    return this.userPackagesService.confirmPackage(id);
  }

  @Post('/reject/:id')
  @Roles('ADMIN')
  rejectPackage(@Param('id') id: string) {
    return this.userPackagesService.rejectPackage(id);
  }
}
