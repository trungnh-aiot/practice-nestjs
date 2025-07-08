import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ERROR_RESPONSE_MESSAGES } from 'src/common/constants/response-messages.constant';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hashSync: jest.requireActual('bcrypt').hashSync,
}));

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let userService: Partial<UserService>;
  let authenticationService: Partial<AuthenticationService>;
  const mockUser: User = {
    id: 1,
    email: 'test@gmail.com',
    hashPassword: bcrypt.hashSync('123456', 10),
  };

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    authenticationService = {
      generateToken: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        { provide: AuthenticationService, useValue: authenticationService },
        { provide: UserService, useValue: userService },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('register successfully', async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(null);
    (userService.create as jest.Mock).mockResolvedValue(mockUser);
    const dto: CreateUserDto = {
      email: mockUser.email,
      password: '123456',
      passwordConfirmation: '123456',
    };
    const result = await controller.register(dto);
    expect(result).toEqual({
      email: mockUser.email,
      id: mockUser.id,
    });
  });
  it('should throw conflict if email already exists', async () => {
    (userService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    const dto: CreateUserDto = {
      email: mockUser.email,
      password: '123456',
      passwordConfirmation: '123456',
    };
    await expect(controller.register(dto)).rejects.toThrow(
      new ConflictException(
        ERROR_RESPONSE_MESSAGES.AUTHENTICATION.EXISTED_EMAIL,
      ),
    );
  });
  it('login successfully', async () => {
    (userService.findByEmail as jest.Mock).mockReturnValue(mockUser);
    (bcrypt.compare as jest.Mock).mockReturnValue(true);
    const tokens = {
      accessToken: '123',
      refreshToken: '1234',
    };
    (authenticationService.generateToken as jest.Mock).mockResolvedValue(
      tokens,
    );
    const loginDto: LoginDto = {
      email: mockUser.email,
      password: '123456',
    };
    expect(await controller.login(loginDto)).toEqual({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: mockUser.id,
        email: mockUser.email,
      },
    });
  });
  it('user not found throw invalid email or password error', async () => {
    (userService.findByEmail as jest.Mock).mockReturnValue(null);
    const dto: CreateUserDto = {
      email: mockUser.email,
      password: '123456',
      passwordConfirmation: '123456',
    };
    await expect(controller.login(dto)).rejects.toThrow(
      new UnauthorizedException(
        ERROR_RESPONSE_MESSAGES.AUTHENTICATION.INVALID_EMAIL_OR_PASSWORD,
      ),
    );
  });
  it('invalid password throw invalid email or password error', async () => {
    (userService.findByEmail as jest.Mock).mockReturnValue(mockUser);
    (bcrypt.compare as jest.Mock).mockReturnValue(false);
    const dto: CreateUserDto = {
      email: mockUser.email,
      password: '123456',
      passwordConfirmation: '123456',
    };
    await expect(controller.login(dto)).rejects.toThrow(
      new UnauthorizedException(
        ERROR_RESPONSE_MESSAGES.AUTHENTICATION.INVALID_EMAIL_OR_PASSWORD,
      ),
    );
  });
});
