import { Injectable } from '@nestjs/common';
import { Config } from './config/config.model';

@Injectable()
export class AppService {
  constructor(private config: Config) {}

  public show(): any {
    const appFoo = this.config.app.foo;
    const dbHost = this.config.database.host;
    const dbPort = this.config.database.port;
    const authSecret = this.config.auth.secret;
    const authExpiresIn = this.config.auth.expiresIn;
    const loggingLevel = this.config.logging.level;
    const loggingFormat = this.config.logging.format;
    const serverPort = this.config.server.port;
    const serverHostname = this.config.server.hostname;

    const out = [
      `app.foo: ${appFoo}`,
      `database.host: ${dbHost}`,
      `database.port: ${dbPort}`,
      `auth.secret: ${authSecret}`,
      `auth.expiresIn: ${authExpiresIn}`,
      `logging.level: ${loggingLevel}`,
      `logging.format: ${loggingFormat}`,
      `server.port: ${serverPort}`,
      `server.hostname: ${serverHostname}`,
    ].join('\n');

    return `${out}\n`;
  }
}
