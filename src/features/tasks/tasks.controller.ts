import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Express } from 'express';
import { basename } from 'path';
import {
  ERROR_RESPONSE_MESSAGES,
  SUCCESS_RESPONSE_MESSAGES,
} from 'src/common/constants/response-messages.constant';
import { LogMethod } from 'src/common/decorators/log-method.decorator';

import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { FileValidationPipe } from './pipe/file-validation.pipe';
import { multerStorage } from './provider/multer-storage';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Post()
  @LogMethod()
  async create(@Body() dto: CreateTaskDto) {
    return await this.tasksService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list task by filter & pagination' })
  @ApiResponse({ status: 200, description: 'List task' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'in-progress', 'done'],
  })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @ApiResponse({
    status: 200,
    description: 'Register account successfully',
    schema: {
      example: {
        status: true,
        path: '/tasks',
        message: 'success',
        statusCode: 200,
        data: {
          tasks: [
            {
              id: '62a93151-6312-4eff-94d8-fb5d0fdd847b',
              title: 'task title',
              description: 'dsadasd',
              status: 'in-progress',
              createdAt: '2025-07-07T01:23:58.364Z',
              file: 'uploads/tasks/1751881710728-mysql.png',
            },
            {
              id: '537bf0aa-6b35-4f65-949c-a76e4fe25b0b',
              title: 'task title',
              description: 'dsadasd',
              status: 'in-progress',
              createdAt: '2025-07-06T19:09:46.633Z',
              file: 'uploads/tasks/1751854314531-nextjs.png',
            },
          ],
          total: 2,
        },
        timestamp: '2025-07-08 08:15:33',
      },
    },
  })
  @LogMethod()
  async findAll(@Query() query: QueryTaskDto) {
    return await this.tasksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the task',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Task details',
    schema: {
      example: {
        status: true,
        path: '/tasks/537bf0aa-6b35-4f65-949c-a76e4fe25b0b',
        message: 'success',
        statusCode: 200,
        data: {
          id: '537bf0aa-6b35-4f65-949c-a76e4fe25b0b',
          title: 'task title',
          description: 'dsadasd',
          status: 'in-progress',
          createdAt: '2025-07-06T19:09:46.633Z',
          file: 'uploads/tasks/1751854314531-nextjs.png',
        },
        timestamp: '2025-07-08 08:18:34',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
    schema: {
      example: {
        status: false,
        statusCode: 404,
        path: '/tasks/537bf0ab-6b35-4f65-949c-a76e4fe25b0b',
        message: 'Task with id 537bf0ab-6b35-4f65-949c-a76e4fe25b0b not found',
        data: null,
        errors: null,
        timestamp: '2025-07-08 08:22:57',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Id is invalid(uuid expected)',
    schema: {
      example: {
        status: false,
        statusCode: 400,
        path: '/tasks/537bf0b-6b35-4f65-949c-a76e4fe25b0b',
        message: 'Validation failed (uuid is expected)',
        data: null,
        errors: null,
        timestamp: '2025-07-08 08:24:38',
      },
    },
  })
  @LogMethod()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tasksService.findOne(id);
  }

  @Post(':id/upload')
  @ApiOperation({ summary: 'Upload a file to a task' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the task',
    type: 'string',
    format: 'uuid',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    description: 'Add File Successfully',
    schema: {
      example: {
        status: true,
        path: '/tasks/62a93151-6312-4eff-94d8-fb5d0fdd847b/upload',
        message: 'success',
        statusCode: 201,
        data: {
          message: 'Upload thành công',
          fileName: '1751938206815-mysql.png',
          mimeType: 'image/png',
          size: 818727,
        },
        timestamp: '2025-07-08 08:30:06',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Id is invalid(uuid expected)',
    schema: {
      example: {
        status: false,
        statusCode: 400,
        path: '/tasks/537bf0b-6b35-4f65-949c-a76e4fe25b0b',
        message: 'Validation failed (uuid is expected)',
        data: null,
        errors: null,
        timestamp: '2025-07-08 08:24:38',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'File is required',
    schema: {
      example: {
        status: false,
        statusCode: 400,
        path: '/tasks/62a93251-6312-4eff-94d8-fb5d0fdd847b/upload',
        message: 'File is required.',
        data: null,
        errors: null,
        timestamp: '2025-07-08 08:33:04',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
    schema: {
      example: {
        status: false,
        statusCode: 404,
        path: '/tasks/537bf0ab-6b35-4f65-949c-a76e4fe25b0b',
        message: 'Task with id 537bf0ab-6b35-4f65-949c-a76e4fe25b0b not found',
        data: null,
        errors: null,
        timestamp: '2025-07-08 08:22:57',
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { storage: multerStorage }))
  @LogMethod()
  async uploadFile(
    @Param('id', ParseUUIDPipe) taskId: string,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ) {
    const task = await this.tasksService.findOne(taskId);
    if (!task) {
      throw new UnprocessableEntityException(
        ERROR_RESPONSE_MESSAGES.TASK.NOT_FOUND,
      );
    }
    await this.tasksService.updateFile(taskId, basename(file.path));
    return {
      message: SUCCESS_RESPONSE_MESSAGES.TASK.UPLOAD_SUCCESSFULLY,
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    };
  }
}
