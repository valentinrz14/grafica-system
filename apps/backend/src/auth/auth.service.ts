import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { JwtPayload } from './dto/jwt-payload.interface';

interface GoogleProfile {
  googleId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    const user = await this.usersService.create({
      email: registerDto.email,
      passwordHash,
      role: UserRole.USER,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phoneNumber: registerDto.phoneNumber,
      oauthProvider: 'local',
      profileComplete: true,
    });

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        profileComplete: user.profileComplete,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        profileComplete: user.profileComplete,
      },
      token,
    };
  }

  async completeProfile(userId: string, profileDto: CompleteProfileDto) {
    const user = await this.usersService.updateProfile(userId, {
      firstName: profileDto.firstName,
      lastName: profileDto.lastName,
      phoneNumber: profileDto.phoneNumber,
      profileComplete: true,
    });

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        profileComplete: user.profileComplete,
      },
      token,
    };
  }

  async registerOrLoginWithGoogle(googleProfile: GoogleProfile) {
    // Try to find user by Google ID first
    const existingGoogleUser = await this.usersService.findByGoogleId(
      googleProfile.googleId,
    );

    if (existingGoogleUser) {
      // User exists with this Google ID, return login
      const token = this.generateToken(existingGoogleUser);
      return {
        user: {
          id: existingGoogleUser.id,
          email: existingGoogleUser.email,
          role: existingGoogleUser.role,
          firstName: existingGoogleUser.firstName,
          lastName: existingGoogleUser.lastName,
          phoneNumber: existingGoogleUser.phoneNumber,
          profileComplete: existingGoogleUser.profileComplete,
        },
        token,
      };
    }

    // Try to find user by email (existing account, link Google)
    const existingEmailUser = await this.usersService.findByEmail(
      googleProfile.email,
    );

    if (existingEmailUser) {
      // Link Google account to existing user
      const linkedUser = await this.usersService.linkGoogleAccount(
        googleProfile.email,
        googleProfile.googleId,
        {
          firstName: googleProfile.firstName,
          lastName: googleProfile.lastName,
        },
      );

      const token = this.generateToken(linkedUser);
      return {
        user: {
          id: linkedUser.id,
          email: linkedUser.email,
          role: linkedUser.role,
          firstName: linkedUser.firstName,
          lastName: linkedUser.lastName,
          phoneNumber: linkedUser.phoneNumber,
          profileComplete: linkedUser.profileComplete,
        },
        token,
      };
    }

    // Create new user with Google OAuth
    const newUser = await this.usersService.create({
      email: googleProfile.email,
      role: UserRole.USER,
      googleId: googleProfile.googleId,
      oauthProvider: 'google',
      firstName: googleProfile.firstName,
      lastName: googleProfile.lastName,
      profileComplete: false, // Need to complete phone number
    });

    const token = this.generateToken(newUser);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        profileComplete: newUser.profileComplete,
      },
      token,
    };
  }

  async validateUser(payload: JwtPayload) {
    return await this.usersService.findById(payload.sub);
  }

  private generateToken(user: {
    id: string;
    email: string;
    role: string;
    firstName?: string | null;
    profileComplete?: boolean | null;
  }): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName ?? undefined,
      profileComplete: user.profileComplete ?? false,
    };
    return this.jwtService.sign(payload);
  }
}
