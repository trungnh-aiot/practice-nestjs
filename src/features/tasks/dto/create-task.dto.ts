import { IsString, IsOptional, IsIn, Length } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @Length(3, 100)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['pending', 'in-progress', 'done'])
  status: 'pending' | 'in-progress' | 'done';
}
