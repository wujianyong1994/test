import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelModule } from './table/Module';

@Module({
  modules: [],
  imports: [],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
