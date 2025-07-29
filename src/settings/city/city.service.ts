import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CityEntity } from './entities/city.entity';
import { successResponse } from 'src/common/utils/response';

@Injectable()
export class CityService {
  constructor(@InjectModel(CityEntity) private model: typeof CityEntity) {}

  async dropdown() {
    const list = await this.model.findAll({
      attributes: [
        ['name', 'name'],
        ['id', 'id'],
      ],
      order: [['name', 'ASC']],
    });
    return successResponse('Cities dropdown fetched successfully', list);
  }
}
