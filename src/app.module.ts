import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelModule } from './table/Module';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
