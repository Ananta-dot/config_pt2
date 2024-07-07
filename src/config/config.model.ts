import { Type } from 'class-transformer';
import { IsDefined, IsString, IsNumber, ValidateNested } from 'class-validator';

export class AppConfig {
  @IsNumber()
  @IsDefined()
  foo: number;
}

export class DatabaseConfig {
  @IsString()
  @IsDefined()
  host: string;

  @IsNumber()
  @IsDefined()
  port: number;
}

export class AuthConfig {
  @IsString()
  @IsDefined()
  secret: string;

  @IsNumber()
  @IsDefined()
  expiresIn: number;
}

export class LoggingConfig {
  @IsString()
  @IsDefined()
  level: string;

  @IsString()
  @IsDefined()
  format: string;
}

export class ServerConfig {
  @IsNumber()
  @IsDefined()
  port: number;

  @IsString()
  @IsDefined()
  hostname: string;
}

export class Config {
  @ValidateNested()
  @Type(() => AppConfig)
  app: AppConfig;

  @ValidateNested()
  @Type(() => DatabaseConfig)
  database: DatabaseConfig;

  @ValidateNested()
  @Type(() => AuthConfig)
  auth: AuthConfig;

  @ValidateNested()
  @Type(() => LoggingConfig)
  logging: LoggingConfig;

  @ValidateNested()
  @Type(() => ServerConfig)
  server: ServerConfig;
}
