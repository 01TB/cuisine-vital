import { Test, TestingModule } from '@nestjs/testing';
import { CuisinierService } from './cuisinier.service';

describe('CuisinierService', () => {
  let service: CuisinierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CuisinierService],
    }).compile();

    service = module.get<CuisinierService>(CuisinierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
