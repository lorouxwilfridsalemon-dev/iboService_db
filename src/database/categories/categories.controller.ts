import {Catch,Controller} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { CategoriesService } from './categories.service';
import { CategoriesDto } from './categories.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async save(@Body(new ValidationPipe()) categoriesDto: CategoriesDto) {
    const result = await this.categoriesService.save(categoriesDto);
    return result;
  }

  @Put(':primaryKey') 
  async update(
    @Body(new ValidationPipe()) categoriesDto: CategoriesDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
    ) {
    const result = await this.categoriesService.update(categoriesDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.categoriesService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.categoriesService.find({});
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.categoriesService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.categoriesService.findById(primaryKey);
    return result;
  }
}

