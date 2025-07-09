import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email already registered',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    example: 'password123',
    description: 'Password length from 8 to 24 characters',
    minLength: 8,
    maxLength: 24,
  })
  @IsNotEmpty()
  @Length(8, 24)
  password: string;
}
