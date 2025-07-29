import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BankEntity } from './entities/bank.entity';
import { successResponse } from 'src/common/utils/response';

@Injectable()
export class BankService {
  constructor(@InjectModel(BankEntity) private model: typeof BankEntity) {}

  async dropdown() {
    const list = await this.model.findAll({
      attributes: [
        ['name_en', 'name'],
        ['id', 'id'],
      ],
      order: [['name_en', 'ASC']],
    });
    return successResponse('Banks dropdown fetched successfully', list);
  }
}
