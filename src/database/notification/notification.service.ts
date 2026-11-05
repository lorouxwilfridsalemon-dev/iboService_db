import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './notification.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async save(notification: object): Promise<Response> {
    const result = await this.notificationRepository.save(notification as NotificationEntity);
    return result; 
  }

  async update(notification: object, primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result = await this.notificationRepository.save({
      ...response.data,
      ...notification,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    const result: any = await this.notificationRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.notificationRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  } 

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.notificationRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: { code: HttpStatus.NOT_FOUND, error: `Aucun notification trouvé` },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

