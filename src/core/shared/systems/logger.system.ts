import { Logger } from '@nestjs/common';

export class LoggerSystem extends Logger {
  error(message: string, trace: string) {
    // add your custom business logic
    super.error(message, trace);
  }
}