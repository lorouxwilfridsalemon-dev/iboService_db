import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClientMetierService } from './client.service';

@Controller('metier/client')
export class ClientMetierController {
  constructor(
    private readonly clientMetierService: ClientMetierService,
  ) { }

  @Get('listeClients')
  async listeClient() {
    return await this.clientMetierService.listeClient();
  }

  
  @Post('creerClient')
  async creerClient(@Body() body: any) {
    return await this.clientMetierService.creerClient(body);
  }
}

