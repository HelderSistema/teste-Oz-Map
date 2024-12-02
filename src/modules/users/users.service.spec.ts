/* eslint-disable quotes */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './model/User';
import { GeocodeAddressService } from '../Integrations/GeocodeAddress/GeocodeAddress.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GetAddresssOrCordenatesHelper } from '@modules/users/helpers/GetAddresssOrCordenates.helper';

jest.mock('@modules/users/helpers/GetAddresssOrCordenates.helper', () => ({
  GetAddresssOrCordenatesHelper: {
    getAddresssOrCordenates: jest.fn(),
  },
}));

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: any;
  let geocodeAddressService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn(),
            find: jest.fn(),
            countDocuments: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            exec: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: GeocodeAddressService,
          useValue: {
            getAddressOrCoordinates: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
    geocodeAddressService = module.get<GeocodeAddressService>(
      GeocodeAddressService,
    );
  });

  describe('createUser', () => {
    it('should throw an error if user already exists', async () => {
      const data: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test',
        address: 'Rua Francisco dias Reis, 247',
      };
      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(data),
      });

      await expect(usersService.createUser(data)).rejects.toThrow(
        new HttpException(
          `User which email '${data.email}' was exist`,
          HttpStatus.FORBIDDEN,
        ),
      );
    });

    describe('getUsers', () => {
      it('should return a paginated list of users', async () => {
        const pagination = { page: 1, pageSize: 10 };
        const users = [
          { email: 'test@example.com', password: 'password', name: 'Test' },
        ];
        userModel.find.mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(users),
              }),
            }),
          }),
        });
        userModel.countDocuments.mockReturnValue({
          exec: jest.fn().mockResolvedValue(users.length),
        });

        const result = await usersService.getUsers(pagination);
        expect(result.items.length).toBe(users.length);
        expect(result.total).toBe(users.length);
      });
    });

    describe('getUser', () => {
      it('should return a user if found', async () => {
        const user = {
          email: 'test@example.com',
          name: 'Test',
        };
        userModel.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(user),
        });

        const result = await usersService.getUser('someId');
        expect(result).toEqual(user);
      });

      it('should throw an error if user not found', async () => {
        userModel.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(usersService.getUser('someId')).rejects.toThrow(
          new HttpException(
            "User with id 'someId' was not found",
            HttpStatus.NOT_FOUND,
          ),
        );
      });
    });

    describe('updateUser', () => {
      it('should update and return the user', async () => {
        const user = {
          email: 'test@example.com',
          password: 'password',
          name: 'Test',
          address: 'Rua francisco dias reis, 247',
        };
        userModel.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(user),
        });
        userModel.findByIdAndUpdate.mockReturnValue({
          exec: jest.fn().mockResolvedValue(user),
        });

        const updateData: UpdateUserDto = {
          name: 'Updated Test',
          address: 'Rua francisco dia reis, 247 Mogi Mirim SP',
        };

        const mockResponse = { name: 'aaa', coordenate: '123213' };
        (
          GetAddresssOrCordenatesHelper.getAddresssOrCordenates as jest.Mock
        ).mockResolvedValue(mockResponse);

        const result = await usersService.updateUser('someId', updateData);
        expect(result).toEqual(user);
      });

      it('should throw an error if user not found during update', async () => {
        userModel.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(
          usersService.updateUser('someId', {} as UpdateUserDto),
        ).rejects.toThrow(
          new HttpException(
            'É obrigatorio envio de address ou cordenadas',
            HttpStatus.NOT_FOUND,
          ),
        );
      });
    });

    describe('removeUser', () => {
      it('should remove the user', async () => {
        const user = {
          email: 'test@example.com',
          password: 'password',
          name: 'Test',
        };
        userModel.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(user),
        });
        userModel.findByIdAndDelete.mockReturnValue({
          exec: jest.fn().mockResolvedValue(user),
        });

        const result = await usersService.removeUser('someId');
        expect(result).toBe(
          "User with id 'someId' has been removed successfully.",
        );
      });

      it('should throw an error if user not found during remove', async () => {
        userModel.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        await expect(usersService.removeUser('someId')).rejects.toThrow(
          new HttpException(
            "User with id 'someId' was not found",
            HttpStatus.FORBIDDEN,
          ),
        );
      });
    });

    describe('getByEmail', () => {
      it('should return user by email', async () => {
        const user = {
          email: 'test@example.com',
          password: 'password',
          name: 'Test',
        };
        userModel.findOne.mockReturnValue({
          exec: jest.fn().mockResolvedValue(user),
        });

        const result = await usersService.getByEmail('test@example.com');
        expect(result).toEqual({ email: user.email, password: user.password });
      });

      it('should return undefined if user not found by email', async () => {
        userModel.findOne.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });

        const result = await usersService.getByEmail('nonexistent@example.com');
        expect(result).toBeUndefined();
      });
    });
  });
});
