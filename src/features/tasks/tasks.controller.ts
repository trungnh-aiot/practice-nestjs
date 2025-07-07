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

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryTaskDto) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id);
  }
  @Post(':id/upload')
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
