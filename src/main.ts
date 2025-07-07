import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from './common/logger/logger.service';
import { setGlobalLogger } from './common/decorators/log-method.decorator';

import { useContainer, ValidationError } from 'class-validator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(LoggerService);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  setGlobalLogger(logger);
  app.useGlobalPipes(
    new ValidationPipe({
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
    .setTitle('practice project')
    .setDescription('The practice project API description')
    .setVersion('1.0')
    .addTag('practice')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
