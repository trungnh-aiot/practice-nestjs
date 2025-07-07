import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Validate } from 'class-validator';
import { PasswordConfirmValidator } from '../validators/password-confirm.validator';
import { UniqueEmailValidator } from '../validators/unique-email.validator';
export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email unique',
  })
  @IsNotEmpty()
  @IsEmail()
  @Validate(UniqueEmailValidator)
  email: string;
  @ApiProperty({
    example: '2312321312',
    description: 'Password length from 8 to 24 characters',
    minLength: 8,
    maxLength: 24,
  })
  @IsNotEmpty()
  @Length(8, 24)
  password: string;
  @ApiProperty({
    example: '2312321312',
    description: 'PasswordConfirmation match with Password',
  })
  @IsNotEmpty()
  @Validate(PasswordConfirmValidator, ['password'])
  passwordConfirmation: string;
}
