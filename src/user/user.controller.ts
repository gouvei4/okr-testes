import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as createUserDto from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: createUserDto.CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get()
  findAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}