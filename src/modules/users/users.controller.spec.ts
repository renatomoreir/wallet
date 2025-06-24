import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { User, UserRole } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register()', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        name: 'Alice',
        email: 'alice@test.com',
        password: 'password123',
        role: UserRole.user,
      };

      const mockUser = {
        userId: 'uuid',
        ...dto,
        createdAt: new Date(),
      } as User;

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.register(dto);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(
        dto.name,
        dto.email,
        dto.password,
        dto.role,
      );
    });
  });

  describe('getAll()', () => {
    it('should return a list of users', async () => {
      const filter: FilterUserDto = { name: 'Alice', email: 'alice@test.com' };
      const mockUsers = [
        { userId: 'uuid1', name: 'Alice', email: 'alice@test.com' },
        { userId: 'uuid2', name: 'Bob', email: 'bob@test.com' },
      ];

      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.getAll(filter);

      expect(result).toEqual(mockUsers);
      expect(mockUsersService.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('getById()', () => {
    it('should return a user by ID', async () => {
      const userId = 'uuid1';
      const mockUser = { userId, name: 'Alice', email: 'alice@test.com' };

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.getById(userId);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('promoteUser()', () => {
    it('should update the role of a user', async () => {
      const userId = 'uuid1';
      const role = { role: UserRole.admin };

      const mockUser = { userId, name: 'Alice', email: 'alice@test.com', role };

      mockUsersService.updateRole.mockResolvedValue(mockUser);

      const result = await controller.promoteUser(userId, role);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.updateRole).toHaveBeenCalledWith(userId, role.role);
    });
  });
});
