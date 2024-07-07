import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const appServiceMock = {
      show: jest.fn().mockReturnValue(
        [
          'app.foo: 1',
          'database.host: local',
          'database.port: 9000',
          'auth.secret: supersecret',
          'auth.expiresIn: 3600',
          'logging.level: debug',
          'logging.format: json',
          'server.port: 8080',
          'server.hostname: localhost',
        ].join('\n'),
      ),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appServiceMock }],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);
  });

  describe('getConfig', () => {
    it('should return configuration from AppService', () => {
      const result = appController.getConfig();
      expect(result).toBe(
        [
          'app.foo: 1',
          'database.host: local',
          'database.port: 9000',
          'auth.secret: supersecret',
          'auth.expiresIn: 3600',
          'logging.level: debug',
          'logging.format: json',
          'server.port: 8080',
          'server.hostname: localhost',
        ].join('\n'),
      );
    });
  });
});
