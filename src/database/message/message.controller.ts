import { Catch, Controller } from '@nestjs/common';
import { ParseJsonPipe } from '../../core/shared/pipes/parse-json.pipe';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { MessageService } from './message.service';
import { MessageDto } from './message.dto';
import { ParseJsonObjectPipe } from 'src/core/shared/pipes/json-object.pipe';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Delete, Get, Post, Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/metier/auth/guards/jwt-auth.guard';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('message')

export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async save(@Body(new ValidationPipe()) messageDto: MessageDto) {
    const result = await this.messageService.save(messageDto);
    return result;
  }

  @Put(':primaryKey')
  @UseGuards(JwtAuthGuard)
  async update(
    @Body(new ValidationPipe()) messageDto: MessageDto,
    @Param('primaryKey', new ParseJsonPipe()) primaryKey,
  ) {
    const result = await this.messageService.update(messageDto, primaryKey);
    return result;
  }

  @Delete(':primaryKey')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.messageService.delete(primaryKey);
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async find() {
    const result = await this.messageService.find({});
    return result;
  }

  @Get('query/:findOption')
  @UseGuards(JwtAuthGuard)
  async findQuery(@Param('findOption', new ParseJsonObjectPipe()) findOption) {
    const result = await this.messageService.find(findOption);
    return result;
  }

  @Get(':primaryKey')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('primaryKey', new ParseJsonPipe()) primaryKey) {
    const result = await this.messageService.findById(primaryKey);
    return result;
  }
}

