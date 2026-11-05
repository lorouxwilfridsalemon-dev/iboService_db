import {Catch,Controller} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { StatutReservationService } from './statut_reservation.service';
import { StatutReservationDto } from './statut_reservation.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('statutReservation')
export class StatutReservationController {
  constructor(private readonly statutReservationService: StatutReservationService) {}

  @Post()
  async save(@Body(new ValidationPipe()) statutReservationDto: StatutReservationDto) {
    const result = await this.statutReservationService.save(statutReservationDto);
    return result;
  }

  @Put(':primaryKey') 
  async update(
    @Body(new ValidationPipe()) statutReservationDto: StatutReservationDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
    ) {
    const result = await this.statutReservationService.update(statutReservationDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.statutReservationService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.statutReservationService.find({});
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.statutReservationService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.statutReservationService.findById(primaryKey);
    return result;
  }
}

