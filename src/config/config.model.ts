import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as deepmerge from 'deepmerge';
import { validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import Ajv, { JSONSchemaType } from 'ajv';

const ajv = new Ajv();

function loadSchema(schemaPath: string): JSONSchemaType<any> {
  const schema = JSON.parse(fs.readFileSync(path.resolve(__dirname, schemaPath), 'utf8'));
  return schema;
}

function validateConfig(schema: JSONSchemaType<any>, data: any): void {
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    throw new Error(`Configuration validation failed: ${JSON.stringify(validate.errors)}`);
  }
}

export class AppConfig {
  foo: number;
}

export class TableConfig {
  name: string;
}

export class DatabaseConfig {
  host: string;
  port: number;
  table: TableConfig;
}

export class AuthConfig {
  secret: string;
  expiresIn: number;
}

export class LoggingConfig {
  level: string;
  format: string;
}

export class ServerConfig {
  port: number;
  hostname: string;
}

export class Config {
  app?: AppConfig;
  database?: DatabaseConfig;
  auth?: AuthConfig;
  logging?: LoggingConfig;
  server?: ServerConfig;
}

export async function loadConfigurations(): Promise<Config> {
  let config: Partial<Config> = {};

  const files = fs.readdirSync('./src/config_files');
  for (const file of files) {
    console.log(`Loading configuration from file: ${file}`);
    const ext = file.split('.').pop();
    if (ext === 'yaml' || ext === 'yml') {
      const fileConfig = yaml.load(fs.readFileSync(`./src/config_files/${file}`, 'utf8')) as Record<string, any>;
      const namespace = file.split('.').shift();
      console.log(`Loaded config for namespace: ${namespace}`, fileConfig);
      config = deepmerge(config, { [namespace]: fileConfig });
    } else if (ext === 'json') {
      const fileConfig = JSON.parse(fs.readFileSync(`./src/config_files/${file}`, 'utf8')) as Record<string, any>;
      const namespace = file.split('.').shift();
      console.log(`Loaded config for namespace: ${namespace}`, fileConfig);
      config = deepmerge(config, { [namespace]: fileConfig });
    }
  }

  console.log('Merged Config:', config);

  // Validate configurations against schemas
  validateConfig(loadSchema('./src/config_schemas/app-schema.json'), config.app);
  validateConfig(loadSchema('./src/config_schemas/database-schema.json'), config.database);
  validateConfig(loadSchema('./src/config_schemas/auth-schema.json'), config.auth);
  validateConfig(loadSchema('./src/config_schemas/logging-schema.json'), config.logging);
  validateConfig(loadSchema('./src/config_schemas/server-schema.json'), config.server);

  const validatedConfig = plainToClass(Config, config);
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed: ${errors.toString()}`);
  }

  return validatedConfig;
}
