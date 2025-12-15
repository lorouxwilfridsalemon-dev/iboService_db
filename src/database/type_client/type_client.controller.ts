import { BadRequestException, Catch, Controller } from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { TypeClientService } from './type_client.service';
import { TypeClientDto } from './type_client.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param, Query } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('type_client')
export class TypeClientController {
  constructor(private readonly typeClientService: TypeClientService) { }

  @Post()
  async save(@Body(new ValidationPipe()) typeClientDto: TypeClientDto) {
    const result = await this.typeClientService.save(typeClientDto);
    return result;
  }

  @Put(':primaryKey')
  async update(
    @Body(new ValidationPipe()) typeClientDto: TypeClientDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
  ) {
    const result = await this.typeClientService.update(typeClientDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.typeClientService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.typeClientService.find({});
    return result;
  }

  // @Get('query/:findOption')
  // async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
  //   const result = await this.typeClientService.find(findOption);
  //   return result;
  // }
  @Get('query')
  async findQuery(@Query('findOption') findOptionString: string) {
    // console.log('findOptionString reçu:', findOptionString);

    try {
      const findOption = JSON.parse(findOptionString);
      const result = await this.typeClientService.find(findOption);
      return result;
    } catch (error) {
      console.error('Erreur parsing JSON:', error);
      throw new BadRequestException('Paramètre findOption invalide');
    }
  }


  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.typeClientService.findById(primaryKey);
    return result;
  }
}

