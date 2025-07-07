import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  UnprocessableEntityException,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerStorage } from './provider/multerStorage';
import { FileValidationPipe } from './pipe/file-validation.pipe';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import { Express } from 'express';
import { ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
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
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'in-progress', 'done'] })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @LogMethod()
  async findAll(@Query() query: QueryTaskDto) {
    return await this.tasksService.findAll(query);
  }

  @Get(':id')
    @ApiOperation({ summary: 'Get a single task by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the task', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Task details' })
  @LogMethod()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tasksService.findOne(id);
  }

  @Post(':id/upload')
    @ApiOperation({ summary: 'Upload a file to a task' })
  @ApiParam({ name: 'id', description: 'UUID of the task', type: 'string', format: 'uuid' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: multerStorage }))
  @LogMethod()
  async uploadFile(
    @Param('id', ParseUUIDPipe) taskId: string,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ) {
    const task = await this.tasksService.findOne(taskId);
    if (!task) {
      throw new UnprocessableEntityException('Task not found');
    }
    await this.tasksService.updateFile(taskId, file.path);
    return {
      message: 'Upload thành công',
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    };
  }
}
