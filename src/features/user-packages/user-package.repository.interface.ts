import { UserPackage } from 'generated/prisma/client';
import { PackageStatus } from 'generated/prisma/enums';

export interface IUserPackagesRepository {
  updateStatus: (id: string, status: PackageStatus) => Promise<UserPackage>;
}
