import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NationalityEntity } from './entities/nationality.entity';
import { successResponse } from 'src/common/utils/response';

@Injectable()
export class NationalityService {
  constructor(
    @InjectModel(NationalityEntity) private model: typeof NationalityEntity,
  ) {}

  async dropdown() {
    const list = await this.model.findAll({
      attributes: [
        ['name', 'name'],
        ['id', 'id'],
      ],
      order: [['name', 'ASC']],
    });
    return successResponse('Nationalities dropdown fetched successfully', list);
  }
}
