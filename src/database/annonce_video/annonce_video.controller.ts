import {Catch,Controller} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { AnnonceVideoService } from './annonce_video.service';
import { AnnonceVideoDto } from './annonce_video.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('annonceVideo')
export class AnnonceVideoController {
  constructor(private readonly annonceVideoService: AnnonceVideoService) {}

  @Post()
  async save(@Body(new ValidationPipe()) annonceVideoDto: AnnonceVideoDto) {
    const result = await this.annonceVideoService.save(annonceVideoDto);
    return result;
  }

  @Put(':primaryKey') 
  async update(
    @Body(new ValidationPipe()) annonceVideoDto: AnnonceVideoDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
    ) {
    const result = await this.annonceVideoService.update(annonceVideoDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.annonceVideoService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.annonceVideoService.find({});
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.annonceVideoService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.annonceVideoService.findById(primaryKey);
    return result;
  }
}

