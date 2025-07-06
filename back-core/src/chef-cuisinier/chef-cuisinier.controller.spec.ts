import { Test, TestingModule } from '@nestjs/testing';
import { ChefCuisinierController } from './chef-cuisinier.controller';

describe('ChefCuisinierController', () => {
  let controller: ChefCuisinierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChefCuisinierController],
    }).compile();

    controller = module.get<ChefCuisinierController>(ChefCuisinierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
