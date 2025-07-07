import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './features/authentication/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './features/user/user.module';
import { User } from './features/user/entities/user.entity';
import { TasksModule } from './features/tasks/tasks.module';
import { Task } from './features/tasks/entities/task.entity';
import { ConfigModule } from '@nestjs/config';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
