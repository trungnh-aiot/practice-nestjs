import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordConfirmValidator } from './validators/password-confirm.validator';
import { UniqueEmailValidator } from './validators/unique-email.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UniqueEmailValidator, PasswordConfirmValidator],
  exports: [UserService],
})
export class UserModule {}
