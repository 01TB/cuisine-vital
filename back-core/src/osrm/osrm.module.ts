// osrm/osrm.module.ts

import { Module } from '@nestjs/common';
import { OsrmController } from './osrm.controller';
import { OsrmService } from './osrm.service';

@Module({
  controllers: [OsrmController],
  providers: [OsrmService],
  exports: [OsrmService], // <-- TRÈS IMPORTANT: pour rendre le service disponible à d'autres modules
})
export class OsrmModule {}