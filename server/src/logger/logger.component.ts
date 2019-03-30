import { Injectable, LoggerService } from '@nestjs/common';
// import { NestEnvironment } from '@nestjs/common/enums/nest-environment.enum';
import chalk from 'chalk';

type Severity = 100 | 200 | 300 | 400;

/**
 * Implementation of the NestJS logger service.
 *
 * See: https://docs.nestjs.com/techniques/logger
 */
@Injectable()
export class LoggerComponent implements LoggerService {
  protected lastTimestamp = Date.now();
  protected envTest = false;
  // protected env = NestEnvironment.RUN;
  protected colors: {
    [severity in Severity]: (msg: string) => string;
  } = {
    100: chalk.white,
    200: chalk.green,
    300: chalk.yellow,
    400: chalk.red,
  };

  constructor() {
    if (process.env.APP_ENV === 'testing') {
      this.envTest = true;
      //this.env = NestEnvironment.TEST;
    }
  }

  log(message: any, context?: string) {
    this.printMessage(message, 200, { context });
  }

  warn(message: any, context?: string) {
    this.printMessage(message, 300, { context });
  }

  error(message: any, trace?: string, context?: string) {
    this.printMessage(message, 400, { trace, context });
  }

  protected printMessage(
    message: string,
    severity: Severity,
    data: { trace?: string; context?: string },
  ) {
    // if (this.env === NestEnvironment.TEST) { return; }
    if (this.envTest) { return; }
    const now = Date.now();
    if (process.env.APP_ENV === 'production') {
      process.stdout.write(
        JSON.stringify({
          message,
          severity,
          data,
          datetime: new Date().toISOString(),
        }),
      );
      process.stdout.write('\n');
    } else {
      process.stdout.write(
        this.colors[severity](
          `[SoccerJS Server] ${new Date(now).toLocaleString()} - ${chalk.yellow(`[${data.context || ''}]`)} ${message}`,
        ),
      );
      process.stdout.write(chalk.yellow(` +${now - this.lastTimestamp}ms`));
      process.stdout.write('\n');
      if (data.trace) {
        process.stdout.write(data.trace);
      }
    }
    this.lastTimestamp = now;
  }
}
