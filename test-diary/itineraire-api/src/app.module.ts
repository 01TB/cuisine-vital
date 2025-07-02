import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OsrmService } from './osrm/osrm.service';
import { OsrmController } from './osrm/osrm.controller';

@Module({
  imports: [],
  controllers: [AppController, OsrmController],
  providers: [AppService, OsrmService],
})
export class AppModule {}
