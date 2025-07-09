import { Body, Controller, Post } from '@nestjs/common';
import { LogMethod } from 'src/common/decorators/log-method.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @LogMethod()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
