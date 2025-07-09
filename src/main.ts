import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';
import { setGlobalLogger } from './common/decorators/log-method.decorator';
import { LoggerService } from './common/logger/logger.service';
import { configuration } from './configs/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(LoggerService);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  setGlobalLogger(logger);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints?.[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException({ errors: result });
      },
      stopAtFirstError: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle(configuration.app.name)
    .setDescription('The practice project API description')
    .setVersion('1.0')
    .addTag('practice')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(configuration.app.port ?? 3001);
}
bootstrap();
