import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

import { TasksModule } from '../tasks/tasks.module';
import { JwtStrategy } from './strategies/jwt-strategy.strategy';

@Module({
  imports: [UserModule, JwtModule, TasksModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy],
})
export class AuthenticationModule {}
