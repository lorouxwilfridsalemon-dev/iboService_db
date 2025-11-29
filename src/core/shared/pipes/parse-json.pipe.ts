import { BadRequestException } from '@nestjs/common';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Console } from 'console';

@Injectable()
export class ParseJsonPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    const val = JSON.parse(value);
    if (val !== null && typeof val === 'object') {
      throw new BadRequestException('Validation object failed');
    }
    return val;
  }
}