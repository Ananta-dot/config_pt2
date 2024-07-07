import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as deepmerge from 'deepmerge';
import { validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Config } from './config.model';

export async function loadConfigurations(): Promise<Config> {
  let config = {};

  const files = fs.readdirSync('./src/config_files');
  for (const file of files) {
    const ext = file.split('.').pop();
    if (ext === 'yaml' || ext === 'yml') {
      const fileConfig = yaml.load(fs.readFileSync(`./src/config_files/${file}`, 'utf8')) as Record<string, any>;
      const namespace = file.split('.').shift();
      config = deepmerge(config, { [namespace]: fileConfig });
    }
  }

  const validatedConfig = plainToClass(Config, config);
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed: ${errors.toString()}`);
  }

  return validatedConfig;
}
