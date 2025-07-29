import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { PermissionService } from '../permissions/permission.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly permissionService: PermissionService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const rawPassword = loginDto.password?.trim();
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    let hashedPassword = user.password?.trim();

    if (!hashedPassword) {
      throw new UnauthorizedException('Password hash missing');
    }

    // ✅ Laravel compatibility: replace $2y$ with $2b$
    if (hashedPassword.startsWith('$2y$')) {
      hashedPassword = hashedPassword.replace('$2y$', '$2b$');
    }

    const passwordMatch = await bcrypt.compare(rawPassword, hashedPassword);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === 'Disabled') {
      throw new UnauthorizedException('User is disabled');
    }

    const flatPermissions = await this.permissionService.getPermissionsByRole(
      user.userlevel,
    );

    // Group actions per module into one line: { module: 'employees', action: 'V,VO,D' }
    const groupedPermissions = flatPermissions.reduce(
      (acc, curr) => {
        const found = acc.find((item) => item.module === curr.module);
        if (found) {
          found.action += `,${curr.action}`;
        } else {
          acc.push({ module: curr.module, action: curr.action });
        }
        return acc;
      },
      [] as { module: string; action: string }[],
    );

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.userlevel,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1d',
    });

    return {
      success: true,
      message: 'Logged in successfully',
      data: {
        user_id: user.id,
        token,
        name: user.name,
        email: user.email,
        user_name: user.user_name,
        role: user.userlevel,
        fullName: user.name,
        username: user.user_name,
        pin: user.pin,
        isPinLocked: user.isPinLocked ? 1 : 0,
        permissions: groupedPermissions,
        status: user.status,
        fcm_token: user.fcm_token,
        employee: null,
      },
    };
  }
}
