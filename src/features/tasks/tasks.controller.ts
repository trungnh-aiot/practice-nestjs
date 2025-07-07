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
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerStorage } from './provider/multerStorage';
import { FileValidationPipe } from './pipe/file-validation.pipe';
import { LogMethod } from 'src/common/decorators/log-method.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Post()
  @LogMethod()
  async create(@Body() dto: CreateTaskDto) {
    return await this.tasksService.create(dto);
  }

  @Get()
  @LogMethod()
  async findAll(@Query() query: QueryTaskDto) {
    return await this.tasksService.findAll(query);
  }

  @Get(':id')
  @LogMethod()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tasksService.findOne(id);
  }

  @Post(':id/upload')
  @LogMethod()
  @UseInterceptors(FileInterceptor('file', { storage: multerStorage }))
  async uploadFile(
    @Param('id', ParseUUIDPipe) taskId: string,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
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
