import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypedConfigModule, directoryLoader } from 'nest-typed-config';
import { Config } from './config/config.model';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: Config,
      load: directoryLoader({
        directory: './src/config_files',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
