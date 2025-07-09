import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-request-exception.filter';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggerModule } from './common/logger/logger.module';
import { configuration } from './configs/configuration';
import { validate } from './configs/environment-variables.config';
import { AuthenticationModule } from './features/authentication/authentication.module';
import { JwtGuard } from './features/authentication/guards/jwt.guard';
import { Task } from './features/tasks/entities/task.entity';
import { TasksModule } from './features/tasks/tasks.module';
import { User } from './features/user/entities/user.entity';
import { UserModule } from './features/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: configuration.database.dbHost,
      port: configuration.database.dbPort,
      username: configuration.database.dbUsername,
      password: configuration.database.dbPassWord,
      database: configuration.database.dbDatabase,
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
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
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
