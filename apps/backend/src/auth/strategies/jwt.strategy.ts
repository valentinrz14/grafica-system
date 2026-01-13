import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../dto/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    const secret = process.env.JWT_SECRET || 'change-me-in-production';
    console.log('JwtStrategy initialized with secret length:', secret.length);
    console.log('Secret starts with:', secret.substring(0, 10) + '...');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      console.log('JWT Strategy: Validating token for user:', payload.sub);
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        console.error('JWT Strategy: User not found:', payload.sub);
        throw new UnauthorizedException('User not found');
      }
      console.log('JWT Strategy: User validated:', user.email);
      return user;
    } catch (error: unknown) {
      console.error(
        'JWT Strategy: Validation error:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw new UnauthorizedException('Invalid token');
    }
  }
}
