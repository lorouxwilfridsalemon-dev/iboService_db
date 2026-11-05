import {Catch,Controller} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { HistoriqueStatutReservationService } from './historique_statut_reservation.service';
import { HistoriqueStatutReservationDto } from './historique_statut_reservation.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('historiqueStatutReservation')
export class HistoriqueStatutReservationController {
  constructor(private readonly historiqueStatutReservationService: HistoriqueStatutReservationService) {}

  @Post()
  async save(@Body(new ValidationPipe()) historiqueStatutReservationDto: HistoriqueStatutReservationDto) {
    const result = await this.historiqueStatutReservationService.save(historiqueStatutReservationDto);
    return result;
  }

  @Put(':primaryKey') 
  async update(
    @Body(new ValidationPipe()) historiqueStatutReservationDto: HistoriqueStatutReservationDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
    ) {
    const result = await this.historiqueStatutReservationService.update(historiqueStatutReservationDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.historiqueStatutReservationService.delete(primaryKey);
    return result;
  }

  @Get()
  async find() {
    const result = await this.historiqueStatutReservationService.find({});
    return result;
  }

  @Get('query/:findOption')
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.historiqueStatutReservationService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.historiqueStatutReservationService.findById(primaryKey);
    return result;
  }
}

