import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private users: User[] = [];

  createUser(dto: CreateUserDto): User {
    if (!dto.name || dto.name.trim() === '') {
      throw new BadRequestException('Name is required');
    }

    if (!dto.cpf || !/^\d{11}$/.test(dto.cpf)) {
      throw new BadRequestException('CPF must have 11 digits');
    }

    if (!dto.email || !dto.email.includes('@')) {
      throw new BadRequestException('Invalid email');
    }

    if (!dto.password || dto.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const cpfExists = this.users.find(u => u.cpf === dto.cpf);
    if (cpfExists) {
      throw new BadRequestException('CPF already registered');
    }

    const emailExists = this.users.find(u => u.email === dto.email);
    if (emailExists) {
      throw new BadRequestException('Email already registered');
    }

    const user: User = {
      id: String(Date.now()),
      name: dto.name.trim(),
      cpf: dto.cpf,
      email: dto.email.toLowerCase(),
      password: dto.password,
    };

    this.users.push(user);
    return user;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  deleteUser(id: string): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new NotFoundException(`User ${id} not found`);
    this.users.splice(index, 1);
  }
}