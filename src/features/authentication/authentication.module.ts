import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TasksModule } from '../tasks/tasks.module';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './strategies/jwt-strategy.strategy';

@Module({
  imports: [UserModule, JwtModule, TasksModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy],
})
export class AuthenticationModule {}
