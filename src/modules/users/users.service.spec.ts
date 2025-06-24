import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Wallet),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find user by email', async () => {
    const mockUser = { email: 'test@test.com' } as User;
    mockUserRepository.findOne.mockResolvedValue(mockUser);

    const result = await service.findByEmail('test@test.com');

    expect(result).toEqual(mockUser);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@test.com' },
      relations: ['wallet'],
    });
  });
});
