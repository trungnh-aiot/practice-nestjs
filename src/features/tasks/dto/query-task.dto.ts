import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsNumberString, IsEnum } from 'class-validator';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export class QueryTaskDto {
  @ApiPropertyOptional({
    description: 'Search keyword for task title',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
  @ApiPropertyOptional({
    description: 'Page (pagination)',
    example: '1',
  })
  @IsOptional()
  @IsNumberString()
  page?: string;
  @ApiPropertyOptional({
    description: 'The number tasks of one page(pagination)',
    example: '10',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
