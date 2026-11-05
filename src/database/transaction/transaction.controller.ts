import { Catch, Controller, Get } from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './transaction.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import {
  Body,
  Param,
} from '@nestjs/common/decorators/http/route-params.decorator';
import {
  Delete,
  Post,
  Put,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
  ) {}

  @Post()
  async save(
    @Body(new ValidationPipe()) transactionDto: TransactionDto,
  ) {
    const result = await this.transactionService.save(transactionDto);
    return result;
  }

  @Put(':primaryKey')
  async update(
    @Body(new ValidationPipe()) transactionDto: TransactionDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
  ) {
    const result = await this.transactionService.update(
      transactionDto,
      primaryKey,
    );
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.transactionService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.transactionService.find({});
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.transactionService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.transactionService.findById(primaryKey);
    return result;
  }
} 

