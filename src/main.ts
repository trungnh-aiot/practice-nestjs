import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './common/logger/logger.service';
import { setGlobalLogger } from './common/decorators/log-method.decorator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(LoggerService);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  setGlobalLogger(logger);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
