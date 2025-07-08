import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { compare } from 'bcrypt';
import { LogMethod } from 'src/common/decorators/log-method.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ERROR_RESPONSE_MESSAGES } from 'src/common/constants/response-messages.constant';
import { Public } from './decorators/public.decorator';
@ApiTags('Auth')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
  ) {}
  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register account' })
  @ApiResponse({
    status: 201,
    description: 'Register account successfully',
    schema: {
      example: {
        status: true,
        path: '/auth/register',
        message: 'success',
        statusCode: 201,
        data: {
          email: 'hoaitrung22dk2a@gmail.com',
          id: 2,
        },
        timestamp: '2025-07-07 22:46:48',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Email Existed Or Confirm Password not match with Password',
    schema: {
      example: {
        status: false,
        statusCode: 400,
        path: '/auth/register',
        message: 'Bad Request Exception',
        data: null,
        errors: [
          {
            property: 'email',
            message: 'hoaitrung22dk2a@gmail.com is taken, please try another',
          },
          {
            property: 'passwordConfirmation',
            message: 'passwordConfirmation should be equal to password.',
          },
        ],
        timestamp: '2025-07-07 23:04:44',
      },
    },
  })
  @LogMethod()
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new ConflictException(
        ERROR_RESPONSE_MESSAGES.AUTHENTICATION.EXISTED_EMAIL,
      );
    }
    const createdUser = await this.userService.create(createUserDto);
    return { email: createdUser.email, id: createdUser.id };
  }
  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'Login successfully',
    schema: {
      example: {
        status: true,
        path: '/auth/login',
        message: 'success',
        statusCode: 201,
        data: {
          accessToken: 're',
          refreshToken: 'ad',
          user: {
            id: 2,
            email: 'hoaitrung22dk2a@gmail.com',
          },
        },
        timestamp: '2025-07-07 23:17:34',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Email or password is incorrect',
    schema: {
      example: {
        status: false,
        statusCode: 401,
        path: '/auth/login',
        message:
          ERROR_RESPONSE_MESSAGES.AUTHENTICATION.INVALID_EMAIL_OR_PASSWORD,
        data: null,
        errors: null,
        timestamp: '2025-07-07 22:09:13',
      },
    },
  })
  @LogMethod()
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        ERROR_RESPONSE_MESSAGES.AUTHENTICATION.INVALID_EMAIL_OR_PASSWORD,
      );
    }
    const isValidPassword: boolean = await compare(password, user.hashPassword);
    if (!isValidPassword) {
      throw new UnauthorizedException(
        ERROR_RESPONSE_MESSAGES.AUTHENTICATION.INVALID_EMAIL_OR_PASSWORD,
      );
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
