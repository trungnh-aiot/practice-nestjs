import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { LogMethod } from 'src/common/decorators/log-method.decorator';

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
  async findAll(
    query: QueryTaskDto,
  ): Promise<{ tasks: Task[]; total: number }> {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;

    const [data, total] = await this.taskRepo.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { tasks: data, total };
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
