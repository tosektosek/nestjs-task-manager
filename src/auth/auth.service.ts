import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-creadentials.dto';
import { UserRepository } from './user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { User, UserRole } from 'src/auth/user.entity';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user: User = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { username, roles } = user;

    const payload: JwtPayload = {
      username,
      roles: (roles as any) as UserRole[],
    };
    const accessToken = await this.jwtService.sign(payload);
    const refreshToken = await this.jwtService.sign(payload, {
      expiresIn: 10000000,
    });

    await user.save();
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    let user;
    try {
      user = await this.jwtService.verify(refreshTokenDto.refresh_token);
    } catch (e) {
      throw new BadRequestException({ error: e.message });
    }
    const { username, roles } = user;
    const payload: JwtPayload = {
      username,
      roles: (roles as any) as UserRole[],
    };

    const accessToken = await this.jwtService.sign(payload);
    const refreshToken = await this.jwtService.sign(payload, {
      expiresIn: 10000000,
    });
    return { accessToken, refreshToken };
  }
}
