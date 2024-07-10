import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypedConfigModule } from 'nest-typed-config';
import { loadConfigurations } from './config/load-config';
import { Config } from './config/config.model';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: Config,
      load: [loadConfigurations],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
