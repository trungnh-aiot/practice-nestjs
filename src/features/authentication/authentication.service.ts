import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { configuration } from 'src/configs/configuration';

import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthenticationService {
  constructor(private readonly jwtService: JwtService) {}
  async generateToken(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: configuration.authentication.accessTokenSecret,
        expiresIn: configuration.authentication.accessTokenExpiresIn,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: configuration.authentication.refreshTokenSecret,
        expiresIn: configuration.authentication.refreshTokenExpiresIn,
      }),
    };
  }
}
