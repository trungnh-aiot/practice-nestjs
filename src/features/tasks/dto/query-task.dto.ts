import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';

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
  @Type(() => String)
  status?: TaskStatus;
  @ApiPropertyOptional({
    description: 'Page (pagination)',
    example: '1',
  })
  @IsOptional()
  @IsNumberString()
  @Type(() => String)
  page?: string;
  @ApiPropertyOptional({
    description: 'The number tasks of one page(pagination)',
    example: '10',
  })
  @IsOptional()
  @IsNumberString()
  @Type(() => String)
  limit?: string;
}
