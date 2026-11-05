import { Body, Catch, Controller, Get, Param, Post, Put, Delete, UseInterceptors, UseGuards} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';

import { ModuleDroitService } from './module-droit.service';
import { ModuleDroitDto } from './module-droit.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('moduleDroit')
export class ModuleDroitController {
    constructor(
        private readonly moduleDroitService: ModuleDroitService,
    ) {}

    @Post()
    // @UseGuards(JwtAuthGuard)
    async save(@Body(new ValidationPipe()) moduleDroitDto: ModuleDroitDto) {
        const result = await this.moduleDroitService.save(moduleDroitDto);
        return result;
    }
	
	@Put(':primaryKey')
    // @UseGuards(JwtAuthGuard)
    async update (@Body(new ValidationPipe()) moduleDroitDto: ModuleDroitDto, @Param('primaryKey', new ParseJsonPipe()) primaryKey) {
        const result = await this.moduleDroitService.update(moduleDroitDto,primaryKey);
        return result;
    }
    
    @Delete(':primaryKey')
    // @UseGuards(JwtAuthGuard)
    async delete (@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
        const result = await this.moduleDroitService.delete(primaryKey);
        return result;
    }

    @Get()
    // @UseGuards(JwtAuthGuard)
    async find() {
        const result = await this.moduleDroitService.find({});
        return result;
    }

    @Get('query/:findOption')
    // @UseGuards(JwtAuthGuard)
    async findQuery(@Param('findOption',  new ParseJsonObjectPipe()) findOption) {
        const result = await this.moduleDroitService.find(findOption);
        return result;
    }

    @Get(':primaryKey')
    // @UseGuards(JwtAuthGuard)
    async findById(@Param('primaryKey',  new ParseJsonPipe()) primaryKey) {
        const result = await this.moduleDroitService.findById(primaryKey);
        return result;
    }
}
