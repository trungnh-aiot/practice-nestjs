import { IsOptional, IsIn, IsNumberString } from 'class-validator';

export class QueryTaskDto {
  @IsOptional()
  @IsIn(['pending', 'in-progress', 'done'])
  status?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
