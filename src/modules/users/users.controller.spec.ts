/* eslint-disable quotes */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';

describe('UsersController', () => {
  let controller: UsersController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: UsersService;

  const mockUserService = {
    createUser: jest.fn(),
    getUsers: jest.fn(),
    getUser: jest.fn(),
    updateUser: jest.fn(),
    removeUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should call createUser with correct parameters', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123123',
        address: 'Rua francisco Dias Reis, 247 - Mogi Mirim/Sp',
      };
      const result = { id: '1', ...dto };
      mockUserService.createUser.mockResolvedValue(result);

      expect(await controller.createUser(dto)).toEqual(result);
      expect(mockUserService.createUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('getUsers', () => {
    it('should call getUsers with pagination parameters', async () => {
      const result = { items: [], total: 0 };
      mockUserService.getUsers.mockResolvedValue(result);

      const params = { page: 1, pageSize: 10, keyword: '' };
      expect(
        await controller.getUsers(params.page, params.pageSize, params.keyword),
      ).toEqual(result);
      expect(mockUserService.getUsers).toHaveBeenCalledWith({
        page: params.page,
        pageSize: params.pageSize,
      });
    });
  });

  describe('getUser', () => {
    it('should call getUser with the correct ID', async () => {
      const id = '1';
      const result = { id, name: 'John Doe', email: 'john.doe@example.com' };
      mockUserService.getUser.mockResolvedValue(result);

      expect(await controller.getUser(id)).toEqual(result);
      expect(mockUserService.getUser).toHaveBeenCalledWith(id);
    });
  });

  describe('updateUser', () => {
    it('should call updateUser with correct parameters', async () => {
      const id = '1';
      const dto: UpdateUserDto = {
        name: 'Updated Name',
        password: '123123',
        address: 'Rua Francisco Dias Reis, 247',
      };
      const result = { id, ...dto };
      mockUserService.updateUser.mockResolvedValue(result);

      expect(await controller.updateUser(id, dto)).toEqual(result);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('removeUser', () => {
    it('should call removeUser with the correct ID', async () => {
      const id = '1';
      mockUserService.removeUser.mockResolvedValue(undefined);

      expect(await controller.removeUser(id)).toBeUndefined();
      expect(mockUserService.removeUser).toHaveBeenCalledWith(id);
    });
  });
});
