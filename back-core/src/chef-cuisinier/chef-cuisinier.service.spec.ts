import { Test, TestingModule } from '@nestjs/testing';
import { ChefCuisinierService } from './chef-cuisinier.service';

describe('ChefCuisinierService', () => {
  let service: ChefCuisinierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChefCuisinierService],
    }).compile();

    service = module.get<ChefCuisinierService>(ChefCuisinierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
