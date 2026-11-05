import {Catch,Controller} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { ReservationService } from './reservation.service';
import { ReservationDto } from './reservation.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async save(@Body(new ValidationPipe()) reservationDto: ReservationDto) {
    const result = await this.reservationService.save(reservationDto);
    return result;
  }

  @Put(':primaryKey')
  async update(
    @Body(new ValidationPipe()) reservationDto: ReservationDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
    ) {
    const result = await this.reservationService.update(reservationDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.reservationService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.reservationService.find({});
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.reservationService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.reservationService.findById(primaryKey);
    return result;
  }
}

