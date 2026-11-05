import {Catch,Controller} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { AnnonceImageService } from './annonce_image.service';
import { AnnonceImageDto } from './annonce_image.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('annonceImage')
export class AnnonceImageController {
  constructor(private readonly annonceImageService: AnnonceImageService) {}

  @Post()
  async save(@Body(new ValidationPipe()) annonceImageDto: AnnonceImageDto) {
    const result = await this.annonceImageService.save(annonceImageDto);
    return result;
  }

  @Put(':primaryKey') 
  async update(
    @Body(new ValidationPipe()) annonceImageDto: AnnonceImageDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
    ) {
    const result = await this.annonceImageService.update(annonceImageDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.annonceImageService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.annonceImageService.find({});
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.annonceImageService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.annonceImageService.findById(primaryKey);
    return result;
  }
}

