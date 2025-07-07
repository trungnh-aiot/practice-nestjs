import { Module } from '@nestjs/common';

import { AuthenticationModule } from './features/authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './features/user/user.module';
import { User } from './features/user/entities/user.entity';
import { TasksModule } from './features/tasks/tasks.module';
import { Task } from './features/tasks/entities/task.entity';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { LoggerModule } from './common/logger/logger.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-request-exception.filter';

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
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
