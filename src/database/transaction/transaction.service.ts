import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { isDefined } from 'class-validator';
import { Response } from '../../core/shared/classes/response.class';
import { TypeOrmHttpParamQuery } from '../../core/shared/classes/typeorm-query';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {} 

  async save(transaction: object): Promise<Response> {
    const result = await this.transactionRepository.save(
      transaction as TransactionEntity,
    );
    return result;
  }

  async update(transaction: object, primaryKey: object): Promise<Response> {
    // ✅ CORRIGÉ : findById retourne l'entité directement (pas response.data)
    const existing: any = await this.findById(primaryKey);
    const result = await this.transactionRepository.save({
      ...existing,
      ...transaction,
    });
    return result;
  }

  async delete(primaryKey: object): Promise<Response> {
    const response: any = await this.findById(primaryKey);
    await this.transactionRepository.delete(primaryKey);
    return response;
  }

  async find(query: object): Promise<Response> {
    const result = await this.transactionRepository.find(
      TypeOrmHttpParamQuery(query),
    );
    return result;
  }

  async findById(primaryKey: object): Promise<Response> {
    const result = await this.transactionRepository.findOne(primaryKey);
    if (!isDefined(result)) {
      throw new HttpException(
        {
          status: {
            code: HttpStatus.NOT_FOUND,
            error: `Aucune transaction trouvée`,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}