import { JwtService } from '@nestjs/jwt';
import { configuration } from 'src/configs/configuration';

import { User } from '../user/entities/user.entity';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let jwtService: Partial<JwtService>;

  beforeEach(() => {
    jwtService = {
      sign: jest.fn().mockReturnValue('mockedToken'),
    };

    service = new AuthenticationService(jwtService as JwtService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should generate access and refresh tokens with correct secrets and payloads', async () => {
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      hashPassword: 'hashed',
    };

    const result = await service.generateToken(mockUser);

    expect(jwtService.sign).toHaveBeenCalledTimes(2);

    expect(jwtService.sign).toHaveBeenCalledWith(
      { email: mockUser.email, sub: mockUser.id },
      {
        secret: configuration.authentication.accessTokenSecret,
        expiresIn: configuration.authentication.accessTokenExpiresIn,
      },
    );

    expect(result).toEqual({
      accessToken: 'mockedToken',
      refreshToken: 'mockedToken',
    });
  });
});
