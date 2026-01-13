import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  passwordHash: string;

  @IsEnum(UserRole)
  role: UserRole;
}
