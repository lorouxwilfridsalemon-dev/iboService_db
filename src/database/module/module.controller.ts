import { Body, Catch, Controller, Get, Param, Post, Put, Delete, UseGuards, UseInterceptors} from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';

import { ModuleService } from './module.service';
import { ModuleDto } from './module.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('module')
export class ModuleController {
    constructor(
        private readonly moduleService: ModuleService,
    ) {}

    @Post()
    // @UseGuards(JwtAuthGuard)
    async save(@Body(new ValidationPipe()) moduleDto: ModuleDto) {
        const result = await this.moduleService.save(moduleDto);
        return result;
    }
	
	@Put(':primaryKey')
    // @UseGuards(JwtAuthGuard)
    async update (@Body(new ValidationPipe()) moduleDto: ModuleDto, @Param('primaryKey', new ParseJsonPipe()) primaryKey) {
        const result = await this.moduleService.update(moduleDto,primaryKey);
        return result;
    }
    
    @Delete(':primaryKey')
    // @UseGuards(JwtAuthGuard)
    async delete (@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
        const result = await this.moduleService.delete(primaryKey);
        return result;
    }

    @Get()
    // @UseGuards(JwtAuthGuard)
    async find() {
        const result = await this.moduleService.find({});
        return result;
    }

    @Get('query/:findOption')
    // @UseGuards(JwtAuthGuard)
    async findQuery(@Param('findOption',  new ParseJsonObjectPipe()) findOption) {
        const result = await this.moduleService.find(findOption);
        return result;
    }

    @Get(':primaryKey')
    // @UseGuards(JwtAuthGuard)
    async findById(@Param('primaryKey',  new ParseJsonPipe()) primaryKey) {
        const result = await this.moduleService.findById(primaryKey);
        return result;
    }
}
