import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getCurrentUser() {
    return {
      statusCode: 200,
      message: 'User retrieved successfully',
      data: { message: 'Guard not yet implemented' },
    };
  }

  @Get()
  async findAll() {
    // Este endpoint será protegido para solo ADMIN
    const users = await this.usersService.findAll();
    return {
      statusCode: 200,
      data: users,
    };
  }
}
