import { Body, Catch, Controller, Get, Param, Post, Put, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ValidationPipe } from '../../core/shared/pipes/validation.pipe';
import { LoggingInterceptor } from '../../core/shared/interceptors/logging.interceptor';
import { EtatMetierService } from './etat.service';
import { Transaction, TransactionManager, EntityManager, getManager } from 'typeorm';
import { UtilisateurEntity } from 'src/database';

@Catch()
@UseInterceptors(LoggingInterceptor)
@Controller('metier/etat')
export class EtatMetierController {
    constructor(
        private readonly etatMetierService: EtatMetierService,
    ) { }

    //     @Post('demandeEtat')
    //     @Transaction()
    //     async saveAjouterEtat(@Body(new ValidationPipe()) etatDto: EtatDto,  @TransactionManager() manager: EntityManager) {
    //         const result = this.etatMetierService.demandeEtat(manager, etatDto);
    //         return result;
    //     }

    //     @Post('ModifierEtat')
    //     @Transaction()
    //     async ModifierEtat(@Body(new ValidationPipe()) etatDto: EtatDto,  @TransactionManager() manager: EntityManager) {
    //         const result = this.etatMetierService.updateEtat(manager, etatDto);
    //         return result;
    //     }

    //     @Post('attribuerEtat')
    //     @Transaction()
    //     async attribuerEtat(@Body(new ValidationPipe()) etatDto: EtatDto,  @TransactionManager() manager: EntityManager) {
    //         const result = this.etatMetierService.attribuerEtat(manager, etatDto);
    //         return result;
    //     }

    //     @Post('rejeterEtat')
    //     @Transaction()
    //     async rejeterEtat(@CurrentUser() user:UtilisateurEntity, @Body(new ValidationPipe()) etatDto: EtatDto,  @TransactionManager() manager: EntityManager) {
    //         const result = this.etatMetierService.rejeterEtat(manager, etatDto, user);
    //         return result;
    //     }

    //     // @Post('SupprimerEtatAttente')
    //     // @Transaction()
    //     // async SupprimerEtatAttente(@Body(new ValidationPipe()) etatDto: EtatDto,  @TransactionManager() manager: EntityManager) {
    //     //     const result = this.etatMetierService.SupprimerEtatAttente(manager, etatDto);
    //     //     return result;
    //     // }
}