import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUserRO } from './user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUserRO> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<IUserRO[]> {
    return await this.usersService.findAll();
  }
}
