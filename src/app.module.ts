import { Module } from '@nestjs/common';

import { AuthenticationModule } from './features/authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './features/user/user.module';
import { User } from './features/user/entities/user.entity';
import { TasksModule } from './features/tasks/tasks.module';
import { Task } from './features/tasks/entities/task.entity';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { LoggerModule } from './common/logger/logger.module';
import { JwtModule } from '@nestjs/jwt';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'nest',
      password: 'nestpass',
      database: 'mydb',
      entities: [User, Task],
      synchronize: true,
    }),
    AuthenticationModule,
    UserModule,
    TasksModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
