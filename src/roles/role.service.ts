import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserLevel } from '../permissions/user-level.entity';
import { User } from '../users/user.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FilterRoleDto } from './dto/filter-role.dto';
import { BulkAssignRoleDto } from './dto/assign-role.dto';
import { successResponse } from '../common/utils/response';
import { paginateQuery } from '../common/utils/db-pagination';
import { Op } from 'sequelize';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(UserLevel)
    private readonly userLevelModel: typeof UserLevel,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(dto: CreateRoleDto, userId: number) {
    const existingRole = await this.userLevelModel.findOne({
      where: { name: dto.name },
    });

    if (existingRole) {
      throw new BadRequestException('Role with this name already exists');
    }

    const role = await this.userLevelModel.create({
      name: dto.name,
      created_by: userId,
      created_at: new Date(),
    } as any);

    return successResponse('Role created successfully', role);
  }

  async findAll(filters: FilterRoleDto) {
    const { page = 1, perPage = 10, search, is_active } = filters;

    const where: any = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    const result = await paginateQuery(this.userLevelModel, {
      where,
      order: [['id', 'DESC']],
      page,
      perPage,
    });

    return successResponse('Roles fetched successfully', result);
  }

  async findOne(id: number) {
    const role = await this.userLevelModel.findByPk(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return successResponse('Role fetched successfully', role);
  }

  async update(id: number, dto: UpdateRoleDto, userId: number) {
    const role = await this.userLevelModel.findByPk(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (dto.name) {
      const existingRole = await this.userLevelModel.findOne({
        where: {
          name: dto.name,
          id: { [Op.ne]: id },
        },
      });

      if (existingRole) {
        throw new BadRequestException('Role with this name already exists');
      }
    }

    await role.update({
      ...dto,
      updated_by: userId,
      updated_at: new Date(),
    });

    return successResponse('Role updated successfully', role);
  }

  async remove(id: number) {
    const role = await this.userLevelModel.findByPk(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const usersWithRole = await this.userModel.count({
      where: { userlevel: id.toString() },
    });

    if (usersWithRole > 0) {
      throw new BadRequestException(
        `Cannot delete role. ${usersWithRole} users are assigned to this role.`,
      );
    }

    await role.destroy();
    return successResponse('Role deleted successfully');
  }

  async dropdown() {
    const roles = await this.userLevelModel.findAll({
      attributes: ['id', 'name'],
      where: { is_active: true },
      order: [['name', 'ASC']],
    });

    return successResponse('Roles dropdown fetched successfully', roles);
  }

  async assignRoleToUser(userId: number, roleId: number, assignedBy: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.userLevelModel.findByPk(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await user.update({
      userlevel: roleId.toString(),
    });

    return successResponse('Role assigned successfully', { userId, roleId });
  }

  async removeRoleFromUser(userId: number, removedBy: number) {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.update({
      userlevel: '',
    });

    return successResponse('Role removed successfully', { userId });
  }

  async getUserRole(userId: number) {
    const user = await this.userModel.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'userlevel'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let role: { id: number; name: string } | null = null;
    if (user.userlevel) {
      const foundRole = await this.userLevelModel.findByPk(user.userlevel, {
        attributes: ['id', 'name'],
      });
      if (foundRole) {
        role = { id: foundRole.id, name: foundRole.name };
      }
    }

    return successResponse('User role fetched successfully', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      role,
    });
  }

  async getRoleUsers(roleId: number, page = 1, perPage = 10) {
    const role = await this.userLevelModel.findByPk(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const result = await paginateQuery(this.userModel, {
      where: { userlevel: roleId.toString() },
      attributes: ['id', 'name', 'email', 'status'],
      order: [['name', 'ASC']],
      page,
      perPage,
    });

    return successResponse('Role users fetched successfully', {
      role: { id: role.id, name: role.name },
      users: result,
    });
  }

  async bulkAssignRoles(dto: BulkAssignRoleDto, assignedBy: number) {
    const { user_ids, role_id } = dto;

    const role = await this.userLevelModel.findByPk(role_id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const users = await this.userModel.findAll({
      where: { id: user_ids },
      attributes: ['id', 'name'],
    });

    if (users.length !== user_ids.length) {
      throw new BadRequestException('Some users not found');
    }

    await this.userModel.update(
      {
        userlevel: role_id.toString(),
      },
      {
        where: { id: user_ids },
      },
    );

    return successResponse('Roles assigned successfully', {
      assigned_count: user_ids.length,
      role: { id: role.id, name: role.name },
    });
  }
}
