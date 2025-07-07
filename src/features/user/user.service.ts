import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { LogMethod } from 'src/common/decorators/log-method.decorator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}
  @LogMethod()
  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.save({
      email: createUserDto.email,
      hashPassword: await bcrypt.hash(
        createUserDto.password,
        Number.parseInt(this.configService.get<string>('SALT_ROUNDS') || '10'),
      ),
    });
  }
  @LogMethod()
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email: email } });
  }
}
