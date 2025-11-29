import { isObject } from 'util';
import { BadRequestException } from '@nestjs/common';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Console } from 'console';

@Injectable()
export class ParseJsonObjectPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    const val = JSON.parse(value);
    if (!isObject) {
      throw new BadRequestException('Validation object failed');
    }
    return val;
  }
}