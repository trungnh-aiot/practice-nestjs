import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, Length } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'task 1',
    description: 'Title of the task (3-100 characters)',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @Length(3, 100)
  title: string;
  @ApiPropertyOptional({
    example: 'Design a new feature for the project',
    description: 'Description of the task (optional)',
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({
    example: 'pending',
    description: 'Status of the task',
    enum: ['pending', 'in-progress', 'done'],
  })
  @IsIn(['pending', 'in-progress', 'done'])
  status: 'pending' | 'in-progress' | 'done';
}
