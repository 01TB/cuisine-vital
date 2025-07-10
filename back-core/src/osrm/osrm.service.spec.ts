import { Test, TestingModule } from '@nestjs/testing';
import { OsrmService } from './osrm.service';

describe('OsrmService', () => {
  let service: OsrmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OsrmService],
    }).compile();

    service = module.get<OsrmService>(OsrmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
