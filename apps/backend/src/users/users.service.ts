import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserData } from './users.interface';

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileComplete?: boolean;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserData) {
    return await this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        profileComplete: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByGoogleId(googleId: string) {
    return await this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        profileComplete: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        profileComplete: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateProfile(userId: string, data: UpdateProfileData) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        profileComplete: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async checkProfileComplete(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        phoneNumber: true,
      },
    });

    if (!user) {
      return false;
    }

    return !!(user.firstName && user.lastName && user.phoneNumber);
  }

  async linkGoogleAccount(
    email: string,
    googleId: string,
    profileData: { firstName?: string; lastName?: string },
  ) {
    return await this.prisma.user.update({
      where: { email },
      data: {
        googleId,
        oauthProvider: 'google',
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      },
    });
  }
}
