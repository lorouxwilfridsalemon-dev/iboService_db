import { Body, Catch, Controller, Get, Param, Post, Put, Delete, UseGuards, UseInterceptors} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';

import { ProfilService } from './profil.service';
import { ProfilDto } from './profil.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('profil')
export class ProfilController {
    constructor(
        private readonly profilService: ProfilService,
    ) {}

    @Post()
    // @UseGuards(JwtAuthGuard)
    async save(@Body(new ValidationPipe()) profilDto: ProfilDto) {
        const result = await this.profilService.save(profilDto);
        return result;
    }
	
	@Put(':primaryKey')
    // @UseGuards(JwtAuthGuard)
    // @UseGuards(JwtAuthGuard)
    async update (@Body(new ValidationPipe()) profilDto: ProfilDto, @Param('primaryKey', new ParseJsonPipe()) primaryKey) {
        const result = await this.profilService.update(profilDto,primaryKey);
        return result;
    }
    
    @Delete(':primaryKey')
    // @UseGuards(JwtAuthGuard)
    async delete (@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
        const result = await this.profilService.delete(primaryKey);
        return result;
    }

    @Get()
    // @UseGuards(JwtAuthGuard)
    async find() {
        const result = await this.profilService.find({});
        return result;
    }

    @Get('query/:findOption')
    // @UseGuards(JwtAuthGuard)
    async findQuery(@Param('findOption',  new ParseJsonObjectPipe()) findOption) {
        const result = await this.profilService.find(findOption);
        return result;
    }

    @Get(':primaryKey')
    // @UseGuards(JwtAuthGuard)
    async findById(@Param('primaryKey',  new ParseJsonPipe()) primaryKey) {
        const result = await this.profilService.findById(primaryKey);
        return result;
    }
}
