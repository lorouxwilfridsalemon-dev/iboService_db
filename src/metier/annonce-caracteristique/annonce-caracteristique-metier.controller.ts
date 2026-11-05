import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AnnonceCaracteristiqueMetierService } from './annonce-caracteristique-metier.service';
import { AnnonceCaracteristiqueEntity } from 'src/database/annonce_caracteristique/annonce_caracteristique.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('annonce-caracteristique') // ⚠️ CHANGÉ : retire "/metier" pour correspondre au frontend
@UseGuards(JwtAuthGuard)
export class AnnonceCaracteristiqueMetierController {
  constructor(private readonly service: AnnonceCaracteristiqueMetierService) {}

  // ✅ GET /annonce-caracteristique/ (toutes)
  @Get('/')
  async findAll(): Promise<AnnonceCaracteristiqueEntity[]> {
    return this.service.findAll();
  }

  // ✅ GET /annonce-caracteristique/query/... (filtre)
  @Get('/query/:query')
  async query(@Param('query') query: string): Promise<AnnonceCaracteristiqueEntity[]> {
    const parsed = JSON.parse(decodeURIComponent(query));
    return this.service.query(parsed);
  }

  // ✅ GET /annonce-caracteristique/:id
  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<AnnonceCaracteristiqueEntity> {
    return this.service.findOne(id);
  }

  // ✅ POST /annonce-caracteristique/ (création)
  @Post('/')
  async create(@Body() data: Partial<AnnonceCaracteristiqueEntity>, @CurrentUser() user: any): Promise<AnnonceCaracteristiqueEntity> {
    data.idusrcreation = user.id;
    data.dateCreation = new Date();
    return this.service.create(data);
  }

  // ✅ PUT /annonce-caracteristique/:id (modification)
  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<AnnonceCaracteristiqueEntity>,
    @CurrentUser() user: any
  ): Promise<AnnonceCaracteristiqueEntity> {
    return this.service.update(id, data);
  }

  // ✅ DELETE /annonce-caracteristique/:id
  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<boolean> {
    return this.service.delete(id);
  }
} 