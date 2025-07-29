// src/users/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreationAttributes } from 'sequelize';
import { Op } from 'sequelize';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ data: User[]; total: number }> {
    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { mobile: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { rows, count } = await this.userModel.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [['id', 'DESC']],
    });

    return { data: rows, total: count };
  }

  async findById(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email }, raw: true });
  }

  async create(
    userData: CreationAttributes<User>,
    userId?: number,
  ): Promise<User> {
    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }
    
    const auditData = {
      ...userData,
      created_by: userId,
      created_at: new Date(),
    };
    return this.userModel.create(auditData);
  }

  async update(
    id: number,
    updateData: UpdateUserDto,
    userId?: number,
  ): Promise<User> {
    const user = await this.findById(id);
    
    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }
    
    const auditData = {
      ...updateData,
      updated_by: userId,
      updated_at: new Date(),
    };
    await user.update(auditData);
    return user;
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    await user.destroy();
  }
}
