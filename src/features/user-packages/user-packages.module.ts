import { Module } from '@nestjs/common';
import { UserPackagesController } from './user-packages.controller';
import { UserPackagesRepository } from './user-packages.repository';
import { UserPackagesService } from './user-packages.service';

@Module({
  controllers: [UserPackagesController],
  providers: [UserPackagesService, UserPackagesRepository],
})
export class UserPackagesModule {}
