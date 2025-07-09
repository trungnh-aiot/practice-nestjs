import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import { configuration } from 'src/configs/configuration';
import { Repository } from 'typeorm/repository/Repository';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  @LogMethod()
  async create(createUserDto: CreateUserDto) {
    //
    //
    return this.usersRepository.save({
      email: createUserDto.email,
      hashPassword: await bcrypt.hash(
        createUserDto.password,
        configuration.authentication.saltRounds,
      ),
    });
  }
  @LogMethod()
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email: email } });
  }
}
