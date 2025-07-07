import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { LogMethod } from 'src/common/decorators/log-method.decorator';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
  ) {}
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new Error('Email already exists');
    }
    const createdUser = await this.userService.create(createUserDto);
    return { email: createdUser.email, id: createdUser.id };
  }
  @Post('login')
  @LogMethod()
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isValidPassword: boolean = await compare(password, user.hashPassword);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const tokens = await this.authenticationService.generateToken(user);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
