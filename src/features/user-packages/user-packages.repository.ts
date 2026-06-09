import { Injectable } from '@nestjs/common';
import { PackageStatus } from 'generated/prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { IUserPackagesRepository } from './user-package.repository.interface';

@Injectable()
export class UserPackagesRepository implements IUserPackagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async updateStatus(id: string, status: PackageStatus) {
    const updatedUserPackage = await this.prisma.userPackage.update({
      where: { id },
      data: { status },
    });
    return updatedUserPackage;
  }
}
