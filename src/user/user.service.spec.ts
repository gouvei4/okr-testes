import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockUser = {
  name: 'Afonso Bassani',
  cpf: '12345678901',
  email: 'afonso@gmail.com',
  password: '123456',
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should create a user with valid data', () => {
      const user = service.createUser(mockUser);

      expect(user.name).toBe('Afonso Bassani');
      expect(user.cpf).toBe('12345678901');
      expect(user.email).toBe('afonso@gmail.com');
      expect(user.id).toBeDefined();
    });

    it('should throw if name is empty', () => {
      expect(() =>
        service.createUser({ ...mockUser, name: '' }),
      ).toThrow(BadRequestException);
    });

    it('should throw if CPF is invalid', () => {
      expect(() =>
        service.createUser({ ...mockUser, cpf: '123' }),
      ).toThrow(BadRequestException);
    });

    it('should throw if CPF has letters', () => {
      expect(() =>
        service.createUser({ ...mockUser, cpf: '1234567890A' }),
      ).toThrow(BadRequestException);
    });

    it('should throw if email is invalid', () => {
      expect(() =>
        service.createUser({ ...mockUser, email: 'emailinvalid' }),
      ).toThrow(BadRequestException);
    });

    it('should throw if password is less than 6 characters', () => {
      expect(() =>
        service.createUser({ ...mockUser, password: '123' }),
      ).toThrow(BadRequestException);
    });

    it('should throw if CPF already registered', () => {
      service.createUser(mockUser);

      expect(() =>
        service.createUser({
          ...mockUser,
          email: 'outro@gmail.com',
        }),
      ).toThrow(BadRequestException);
    });

    it('should throw if email already registered', () => {
      service.createUser(mockUser);

      expect(() =>
        service.createUser({
          ...mockUser,
          cpf: '99999999999',
        }),
      ).toThrow(BadRequestException);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', () => {
      const created = service.createUser(mockUser);

      const found = service.getUserById(created.id);

      expect(found.email).toBe('afonso@gmail.com');
    });

    it('should throw if user not found', () => {
      expect(() =>
        service.getUserById('id-inexistente'),
      ).toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete an existing user', () => {
      const user = service.createUser(mockUser);

      service.deleteUser(user.id);

      expect(service.getAllUsers()).toHaveLength(0);
    });

    it('should throw if user not found', () => {
      expect(() =>
        service.deleteUser('id-inexistente'),
      ).toThrow(NotFoundException);
    });
  });

  describe('getAllUsers', () => {
    it('should return empty array initially', () => {
      expect(service.getAllUsers()).toEqual([]);
    });

    it('should return users after creating', () => {
      service.createUser(mockUser);

      service.createUser({
        ...mockUser,
        cpf: '99999999999',
        email: 'email@outro.com',
      });

      expect(service.getAllUsers()).toHaveLength(2);
    });
  });
});