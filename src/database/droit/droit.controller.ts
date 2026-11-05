import { Body, Catch, Controller, Get, Param, Post, Put, Delete, UseGuards, UseInterceptors} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';

import { DroitService } from './droit.service';
import { DroitDto } from './droit.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('droit')
export class DroitController {
    constructor(
        private readonly droitService: DroitService,
    ) {}

    @Post()
    // @UseGuards(JwtAuthGuard)
    async save(@Body(new ValidationPipe()) droitDto: DroitDto) {
        const result = await this.droitService.save(droitDto);
        return result;
    }
	
    @Put(':primaryKey')
    // @UseGuards(JwtAuthGuard)
    async update (@Body(new ValidationPipe()) droitDto: DroitDto, @Param('primaryKey', new ParseJsonPipe()) primaryKey) {
        const result = await this.droitService.update(droitDto,primaryKey);
        return result;
    }
    
    @Delete(':primaryKey')
    // @UseGuards(JwtAuthGuard)
    async delete (@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
        const result = await this.droitService.delete(primaryKey);
        return result;
    }

    @Get()
    // @UseGuards(JwtAuthGuard)
    async find() {
        const result = await this.droitService.find({});
        return result;
    }

    @Get('query/:findOption')
    // @UseGuards(JwtAuthGuard)
    async findQuery(@Param('findOption',  new ParseJsonObjectPipe()) findOption) {
        const result = await this.droitService.find(findOption);
        return result;
    }

    @Get(':primaryKey')
    // @UseGuards(JwtAuthGuard)
    async findById(@Param('primaryKey',  new ParseJsonPipe()) primaryKey) {
        const result = await this.droitService.findById(primaryKey);
        return result;
    }
}
