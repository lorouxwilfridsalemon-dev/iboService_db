import {Catch,Controller} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { SignalementService } from './signalement.service';
import { SignalementDto } from './signalement.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('signalement')
export class SignalementController {
  constructor(private readonly signalementService: SignalementService) {}

  @Post()
  async save(@Body(new ValidationPipe()) signalementDto: SignalementDto) {
    const result = await this.signalementService.save(signalementDto);
    return result;
  }

  @Put(':primaryKey')
  async update(
    @Body(new ValidationPipe()) signalementDto: SignalementDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
    ) {
    const result = await this.signalementService.update(signalementDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.signalementService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.signalementService.find({});
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.signalementService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.signalementService.findById(primaryKey);
    return result;
  }
}

