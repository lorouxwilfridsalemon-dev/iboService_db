import { Catch, Controller, Get } from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { PortefeuilleService } from './portefeuille.service';
import { PortefeuilleDto } from './portefeuille.dto';
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
@Controller('portefeuille')
export class PortefeuilleController {
  constructor(
    private readonly portefeuilleService: PortefeuilleService,
  ) {}

  @Post()
  async save(
    @Body(new ValidationPipe()) portefeuilleDto: PortefeuilleDto,
  ) {
    const result = await this.portefeuilleService.save(portefeuilleDto);
    return result;
  }

  @Put(':primaryKey')
  async update(
    @Body(new ValidationPipe()) portefeuilleDto: PortefeuilleDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
  ) {
    const result = await this.portefeuilleService.update(
      portefeuilleDto,
      primaryKey,
    );
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.portefeuilleService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.portefeuilleService.find({});
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.portefeuilleService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.portefeuilleService.findById(primaryKey);
    return result;
  }
}