import { IsOptional, IsString } from 'class-validator';
import { SearchDto } from 'src/common/dto/search.dto';

export class DoctorListQueryDto extends SearchDto {
  @IsString()
  @IsOptional()
  typeId?: string;
}
