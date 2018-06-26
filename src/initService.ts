import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function init(){
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(3001);
}
