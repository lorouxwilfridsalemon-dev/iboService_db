import { Catch, Controller, Get } from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
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
import { RetraitService } from './retrait.service';
import { RetraitDto } from './retrait.dto';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('retrait')
export class RetraitController {
  constructor(
    private readonly retraitService: RetraitService,
  ) {}

  @Post()
  async save(
    @Body(new ValidationPipe()) retraitDto: RetraitDto,
  ) {
    const result = await this.retraitService.save(retraitDto);
    return result;
  }

  @Put(':primaryKey')
  async update(
    @Body(new ValidationPipe()) retraitDto: RetraitDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
  ) {
    const result = await this.retraitService.update(
      retraitDto,
      primaryKey,
    );
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.retraitService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.retraitService.find({});
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.retraitService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.retraitService.findById(primaryKey);
    return result;
  }
} 