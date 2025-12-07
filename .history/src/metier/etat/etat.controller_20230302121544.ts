import { Body, Catch, Controller, Get, Param, Post, Put, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { VisiteMetierService } from './visite.service';
import { Transaction, TransactionManager, EntityManager, getManager } from 'typeorm';
import VisiteDto from 'src/database/visite/visite.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UtilisateurEntity } from 'src/database';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('metier/visite')
export class VisiteMetierController {
    constructor(
        private readonly visiteMetierService: VisiteMetierService,
    ) { }
    
    @Post('demandeVisite')
    @Transaction()
    async saveAjouterVisite(@Body(new ValidationPipe()) visiteDto: VisiteDto,  @TransactionManager() manager: EntityManager) {
        const result = this.visiteMetierService.demandeVisite(manager, visiteDto);
        return result;
    }

    @Post('ModifierVisite')
    @Transaction()
    async ModifierVisite(@Body(new ValidationPipe()) visiteDto: VisiteDto,  @TransactionManager() manager: EntityManager) {
        const result = this.visiteMetierService.updateVisite(manager, visiteDto);
        return result;
    }

    @Post('attribuerVisite')
    @Transaction()
    async attribuerVisite(@Body(new ValidationPipe()) visiteDto: VisiteDto,  @TransactionManager() manager: EntityManager) {
        const result = this.visiteMetierService.attribuerVisite(manager, visiteDto);
        return result;
    }

    @Post('rejeterVisite')
    @Transaction()
    async rejeterVisite(@CurrentUser() user:UtilisateurEntity, @Body(new ValidationPipe()) visiteDto: VisiteDto,  @TransactionManager() manager: EntityManager) {
        const result = this.visiteMetierService.rejeterVisite(manager, visiteDto, user);
        return result;
    }

    // @Post('SupprimerVisiteAttente')
    // @Transaction()
    // async SupprimerVisiteAttente(@Body(new ValidationPipe()) visiteDto: VisiteDto,  @TransactionManager() manager: EntityManager) {
    //     const result = this.visiteMetierService.SupprimerVisiteAttente(manager, visiteDto);
    //     return result;
    // }
}