import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsNumberString } from 'class-validator';

export class QueryTaskDto {
    @ApiPropertyOptional({
    description: 'Search keyword for task title',
    enum: ['pending', 'in-progress', 'done'],
    example: 'in-progress',
  })
  @IsOptional()
  @IsIn(['pending', 'in-progress', 'done'])
  status?: string;
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
