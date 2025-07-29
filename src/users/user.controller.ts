// src/users/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { CreationAttributes } from 'sequelize';
import { Query } from '@nestjs/common';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { RequestLogInterceptor } from '@/common/interceptors/request-log.interceptor';
import { RequestLog } from '@/common/decorators/request-log.decorator';
import { UseInterceptors } from '@nestjs/common';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated and searchable users' })
  @ApiResponse({ status: 200, description: 'Paginated users' })
  async findAll(@Query() pagination: PaginationQueryDto) {
    const { page, limit, search } = pagination;
    return this.usersService.findAll(page, limit, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findById(+id);
  }

  @Post()
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'users', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    return this.usersService.create(
      createUserDto as CreationAttributes<User>,
      Number(req.user.userId),
    );
  }

  @Put(':id')
  @UseInterceptors(RequestLogInterceptor)
  @RequestLog({ module: 'users', recordIdKey: 'id' })
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<User> {
    return this.usersService.update(
      +id,
      updateUserDto,
      Number(req.user.userId),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  delete(@Param('id') id: number): Promise<void> {
    return this.usersService.delete(+id);
  }
}
