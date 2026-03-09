import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mock } from 'node:test';

const mockUser = {
    id: '123',
    name: 'Afonso Bassani',
    cpf: '12345678901',
    email: 'afonso@gmail.com',
    password: '123456'
};

const mockUserService = {
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    deleteUser: jest.fn(),
}



describe('UserController', () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();

        controller = module.get<UserController>(UserController)
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should call createUser and return the new user', () => {
            mockUserService.createUser.mockReturnValue(mockUser);

            const result = controller.create({
                name: 'Afonso Bassani',
                cpf: '12345678901',
                email: 'afonso@gmail.com',
                password: '123456',
            });

            expect(result).toEqual(mockUser);
            expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
        })

        it('should throw BadRequestException if email already registered', () => {
            mockUserService.createUser.mockImplementation(() => {
                throw new BadRequestException('Email already registered');
            });

            expect(() => controller.create({ ...mockUser }))
                .toThrow(BadRequestException);
        })

        it('should throw BadRequestException if CPF already registered', () => {
            mockUserService.createUser.mockImplementation(() => {
                throw new BadRequestException('CPF already registered');
            });

            expect(() => controller.create({ ...mockUser }))
                .toThrow(BadRequestException);
        })

        it('should return list of users', () => {
            mockUserService.getAllUsers.mockReturnValue([mockUser]);

            const result = controller.findAll();

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Afonso Bassani');
            expect(mockUserService.getAllUsers).toHaveBeenCalledTimes(1);
        })

        it('should return empty array if no users', () => {
            mockUserService.getAllUsers.mockReturnValue([]);

            const result = controller.findAll();

            expect(result).toEqual([]);
        })

        it('should return user by id', () => {
            mockUserService.getUserById.mockReturnValue(mockUser);

            const result = controller.findOne('123');

            expect(result).toEqual(mockUser);
            expect(mockUserService.getUserById).toHaveBeenCalledWith('123');
        })

        it('should throw NotFoundException if user not found', () => {
            mockUserService.getUserById.mockImplementation(() => {
                throw new NotFoundException('User not found');
            })

            expect(() => controller.findOne('id-inexistente'))
                .toThrow(NotFoundException);
        })

        it('should call deleteUser with correct id', () => {
            mockUserService.deleteUser.mockReturnValue(undefined);

            controller.remove('123');

            expect(mockUserService.deleteUser).toHaveBeenCalledWith('123');
            expect(mockUserService.deleteUser).toHaveBeenCalledTimes(1);
        })

        it('should throw NotFoundException if user not found', () => {
            mockUserService.deleteUser.mockImplementation(() => {
                throw new NotFoundException('User not found');
            });

            expect(() => controller.remove('id-inexistente'))
                .toThrow(NotFoundException);
        })
    })



})