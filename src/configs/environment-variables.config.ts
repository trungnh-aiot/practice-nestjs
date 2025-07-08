import { plainToInstance, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsOptional()
  APP_NAME?: string;
  @IsNotEmpty()
  ACCESS_TOKEN_EXPIRES_IN: string;
  @IsNotEmpty()
  REFRESH_TOKEN_EXPIRES_IN: string;
  @IsNotEmpty()
  ACCESS_TOKEN_SECRET: string;
  @IsNotEmpty()
  REFRESH_TOKEN_SECRET: string;
  @IsOptional()
  @Type(() => Number)
  APP_PORT?: number;
  @IsNotEmpty()
  DB_HOST: string;
  @IsNotEmpty()
  DB_USERNAME: string;
  @IsNotEmpty()
  DB_PASSWORD: string;
  @IsNotEmpty()
  @Type(() => Number)
  DB_PORT: number;
  @IsNotEmpty()
  SALT_ROUNDS: string;
  @IsNotEmpty()
  DB_DATABASE: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
