import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { PackageStatus } from 'generated/prisma/enums';
import { SearchDto } from 'src/common/dto/search.dto';

export class UserPackageListQueryDto extends SearchDto {
  @IsEnum(PackageStatus)
  @IsOptional()
  status?: PackageStatus;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  purchaseDate?: Date;
}
