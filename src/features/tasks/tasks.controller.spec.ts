import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto, TaskStatus } from './dto/query-task.dto';
import { UnprocessableEntityException } from '@nestjs/common';
import { Task } from './entities/task.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: Partial<Record<keyof TasksService, jest.Mock>>;

  const mockTask: Task = {
    id: 'uuid-1',
    title: 'Test Task',
    description: 'Description',
    status: 'pending',
    createdAt: new Date(),
    file: undefined,
  };

  beforeEach(async () => {
    tasksService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      updateFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: tasksService }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const dto: CreateTaskDto = {
        title: 'New Task',
        description: 'Do something',
        status: 'pending',
      };
      (tasksService.create as jest.Mock).mockResolvedValue(mockTask);
      const result = await controller.create(dto);
      expect(result).toEqual(mockTask);
      expect(tasksService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return list of tasks', async () => {
      const query: QueryTaskDto = { status: TaskStatus.PENDING };
      (tasksService.findAll as jest.Mock).mockResolvedValue({
        tasks: [mockTask],
        total: 1,
      });
      const result = await controller.findAll(query);
      expect(result.tasks.length).toBe(1);
      expect(tasksService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      (tasksService.findOne as jest.Mock).mockResolvedValue(mockTask);
      const result = await controller.findOne(mockTask.id);
      expect(result).toEqual(mockTask);
      expect(tasksService.findOne).toHaveBeenCalledWith(mockTask.id);
    });
  });

  describe('uploadFile', () => {
    const file = {
      path: 'uploads/tasks/test.png',
      filename: 'test.png',
      mimetype: 'image/png',
      size: 1024,
    } as Express.Multer.File;

    it('should throw if task not found', async () => {
      (tasksService.findOne as jest.Mock).mockResolvedValue(null);
      await expect(
        controller.uploadFile('uuid-not-found', file),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should update file for task', async () => {
      (tasksService.findOne as jest.Mock).mockResolvedValue(mockTask);
      (tasksService.updateFile as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.uploadFile(mockTask.id, file);
      expect(result).toEqual({
        message: expect.any(String),
        fileName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
      });
    });
  });
});
