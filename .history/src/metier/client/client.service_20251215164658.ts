import { Injectable } from '@nestjs/common';
import { EntityManager, getManager } from 'typeorm';
import { ClientEntity } from '../../database/client/client.entity';
import { TypeClientEntity } from '../../database/type_client/type_client.entity';

@Injectable()
export class ClientMetierService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

  async listeClient() {
    const manager = getManager();

    const clients = await manager.createQueryBuilder(ClientEntity, 'client')
      .select([
        'client',
        'typeClient',
      ])
      .leftJoin('client.typeClient', 'typeClient')
      .where('client.geler = 0')
      .orderBy('client.dateCreation', 'DESC')
      .getMany();


    return clients;
  }


  async creerClient(body: any) {
    const nomPrenom = body.nomPrenom;
    const numero = body.numero;
    const typeClientId = body.typeClientId;
    const idusrcreation = body.idusrcreation;

    // Charger le type client
    const typeClient = await this.entityManager.findOne(TypeClientEntity, {
      where: { id: typeClientId },
    });

    if (!typeClient) {
      throw new Error('Type client introuvable');
    }

    const maintenant = new Date();

    const client = this.entityManager.create(ClientEntity, {
      nomPrenom,
      numero,
      typeClient,
      geler: 0,
      dateCreation: maintenant,
      idusrcreation,
    });

    const clientSauvegarde = await this.entityManager.save(ClientEntity, client);

    return clientSauvegarde;
  }

}

