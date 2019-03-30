import { Module, Global } from '@nestjs/common';

import { LoggerComponent } from './logger.component';

@Global()
@Module({
  providers: [LoggerComponent],
  exports: [LoggerComponent],
})
export class LoggerModule {}
