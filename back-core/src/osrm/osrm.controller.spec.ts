import { Test, TestingModule } from '@nestjs/testing';
import { OsrmController } from './osrm.controller';

describe('OsrmController', () => {
  let controller: OsrmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OsrmController],
    }).compile();

    controller = module.get<OsrmController>(OsrmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
