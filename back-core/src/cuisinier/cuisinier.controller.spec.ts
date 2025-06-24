import { Test, TestingModule } from '@nestjs/testing';
import { CuisinierController } from './cuisinier.controller';

describe('CuisinierController', () => {
  let controller: CuisinierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CuisinierController],
    }).compile();

    controller = module.get<CuisinierController>(CuisinierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
