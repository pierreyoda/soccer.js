import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { LoggerComponent } from './logger/logger.component';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerComponent(),
  });
  app.setGlobalPrefix('api/v1');
  await app.listen(3001);
};
bootstrap();
