import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto, TaskStatus } from './dto/query-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repo: jest.Mocked<Repository<Task>>;

  const mockTask: Task = {
    id: 'uuid-123',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    createdAt: new Date(),
    file: undefined,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get(getRepositoryToken(Task));
  });

  describe('create', () => {
    it('should create and save a new task', async () => {
      const dto: CreateTaskDto = {
        title: 'Test',
        description: 'Desc',
        status: 'pending',
      };
      repo.create.mockReturnValue(mockTask);
      repo.save.mockResolvedValue(mockTask);

      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(mockTask);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return paginated list of tasks', async () => {
      const query: QueryTaskDto = {
        page: '1',
        limit: '2',
        status: TaskStatus.PENDING,
      };
      repo.findAndCount.mockResolvedValue([[mockTask], 1]);

      const result = await service.findAll(query);
      expect(repo.findAndCount).toHaveBeenCalledWith({
        where: { status: TaskStatus.PENDING },
        skip: 0,
        take: 2,
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual({ tasks: [mockTask], total: 1 });
    });

    it('should work with default pagination', async () => {
      const query: QueryTaskDto = {};
      repo.findAndCount.mockResolvedValue([[mockTask], 1]);

      const result = await service.findAll(query);
      expect(repo.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return task by id', async () => {
      repo.findOneBy.mockResolvedValue(mockTask);
      const result = await service.findOne(mockTask.id);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: mockTask.id });
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        new NotFoundException(`Task with id invalid-id not found`),
      );
    });
  });

  describe('updateFile', () => {
    it('should call update with correct params', async () => {
      repo.update.mockResolvedValue({ affected: 1 } as any);
      await service.updateFile('uuid-123', 'file/path.png');
      expect(repo.update).toHaveBeenCalledWith('uuid-123', {
        file: 'file/path.png',
      });
    });
  });
});
