import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}
  @LogMethod()
  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepo.create(dto);

    return await this.taskRepo.save(task);
  }
  @LogMethod()
  async findAll(query: QueryTaskDto): Promise<{
    tasks: Task[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Task> = {};
    if (query.status) where.status = query.status;

    const [data, total] = await this.taskRepo.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      tasks: data,
      meta: {
        totalItems: total,
        itemsPerPage: limit,
        itemCount: data.length,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }
  @LogMethod()
  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepo.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }
  @LogMethod()
  async updateFile(id: string, filePath: string) {
    return await this.taskRepo.update(id, { file: filePath });
  }
}
